const crypto = require("crypto");
const { assertFound } = require("../utils/errors");
const { readIssues, writeIssues, readProjects } = require("../utils/fileDb");
const { getUserSnapshot } = require("../utils/authUserSnapshot");
const {
  assertRequiredString,
  assertOneOf,
  assertMinLength,
  assertValidDate,
} = require("../utils/validators");
const { logActivity } = require("./activity.service");

function assertAllowedStatus(status) {
  return assertOneOf(status, "status", ["todo", "in_progress", "done"]);
}

function validateTitle(title) {
  const t = assertRequiredString(title, "title");
  return assertMinLength(t, "title", 4);
}

function validatePriority(priority) {
  if (priority === undefined) return "medium";

  const p = String(priority).trim().toLowerCase();

  assertOneOf(p, "priority", ["low", "medium", "high", "critical"]);

  return p;
}

function validateDueDate(dueDate) {
  const validated = assertValidDate(dueDate, "dueDate");

  if (validated === undefined || validated === null) {
    return null;
  }

  return new Date(validated).toISOString();
}

function validateAssignedTo(assignedTo) {
  const a = assertRequiredString(assignedTo, "assignedTo");
  return assertMinLength(a, "assignedTo", 2);
}

async function ensureProjectExists(projectId) {
  const projects = await readProjects();

  const project = projects.find((p) => p.id === projectId);

  assertFound(project, "Project not found");

  return project;
}

function getNextRankForProject(issues, projectId) {
  const projectIssues = issues.filter((issue) => issue.projectId === projectId);

  if (projectIssues.length === 0) {
    return 1;
  }

  const maxRank = projectIssues.reduce((max, issue) => {
    const rank = typeof issue.rank === "number" ? issue.rank : 0;
    return rank > max ? rank : max;
  }, 0);

  return maxRank + 1;
}

// ✅ Create issue
async function createIssue(
  {
    title,
    projectId = null,
    labels = [],
    priority,
    dueDate,
    assignedTo,
  },
  currentUser
) {
  if (projectId) {
    await ensureProjectExists(projectId);
  }

  const issues = await readIssues();
  const now = new Date().toISOString();
  const userSnapshot = getUserSnapshot(currentUser);

  const issue = {
    id: crypto.randomUUID(),
    projectId,
    title: validateTitle(title),
    status: "todo",
    priority: validatePriority(priority),
    dueDate: validateDueDate(dueDate),
    rank: projectId ? getNextRankForProject(issues, projectId) : null,
    labels,
    assignedTo: assignedTo !== undefined ? validateAssignedTo(assignedTo) : null,
    createdAt: now,
    updatedAt: now,
    createdBy: userSnapshot,
    updatedBy: userSnapshot,
  };

  issues.push(issue);

  await writeIssues(issues);

  await logActivity({
    entityType: "issue",
    entityId: issue.id,
    action: "issue_created",
    message: `Issue "${issue.title}" created`,
  });

  return issue;
}

// ✅ List all issues
async function listIssues() {
  return readIssues();
}

// ✅ Get issue by id
async function getIssueById(id) {
  const issues = await readIssues();

  const issue = issues.find((i) => i.id === id);

  assertFound(issue, "Issue not found");

  return issue;
}

// ✅ Update issue
async function updateIssue(
  id,
  { title, status, labels, priority, dueDate },
  currentUser
) {
  const issues = await readIssues();

  const index = issues.findIndex((i) => i.id === id);
  const issue = issues[index];

  assertFound(issue, "Issue not found");

  const oldStatus = issue.status;
  const nextStatus =
    status !== undefined
      ? (assertAllowedStatus(status), status)
      : issue.status;

  const updatedIssue = {
    ...issue,
    title: title !== undefined ? validateTitle(title) : issue.title,
    status: nextStatus,
    priority:
      priority !== undefined
        ? validatePriority(priority)
        : issue.priority || "medium",
    dueDate:
      dueDate !== undefined
        ? validateDueDate(dueDate)
        : issue.dueDate || null,
    labels: labels !== undefined ? labels : issue.labels || [],
    updatedAt: new Date().toISOString(),
    updatedBy: getUserSnapshot(currentUser),
  };

  issues[index] = updatedIssue;

  await writeIssues(issues);

  const statusChanged = oldStatus !== updatedIssue.status;

  await logActivity({
    entityType: "issue",
    entityId: updatedIssue.id,
    action: statusChanged ? "issue_status_changed" : "issue_updated",
    message: statusChanged
      ? `Issue status changed from ${oldStatus} to ${updatedIssue.status}`
      : `Issue "${updatedIssue.title}" updated`,
  });

  return updatedIssue;
}

// ✅ Assign issue
async function assignIssueById(id, { assignedTo }, currentUser) {
  const issues = await readIssues();

  const index = issues.findIndex((i) => i.id === id);
  const issue = issues[index];

  assertFound(issue, "Issue not found");

  const updatedIssue = {
    ...issue,
    assignedTo: validateAssignedTo(assignedTo),
    updatedAt: new Date().toISOString(),
    updatedBy: getUserSnapshot(currentUser),
  };

  issues[index] = updatedIssue;

  await writeIssues(issues);

  await logActivity({
    entityType: "issue",
    entityId: updatedIssue.id,
    action: "issue_assigned",
    message: `Issue assigned to ${updatedIssue.assignedTo}`,
  });

  return updatedIssue;
}

// ✅ Delete issue
async function deleteIssue(id) {
  const issues = await readIssues();

  const index = issues.findIndex((i) => i.id === id);

  const issue = issues[index];

  assertFound(issue, "Issue not found");

  issues.splice(index, 1);

  await writeIssues(issues);

  await logActivity({
    entityType: "issue",
    entityId: issue.id,
    action: "issue_deleted",
    message: `Issue "${issue.title}" deleted`,
  });

  return issue;
}

// ✅ List issues by project
async function listIssuesByProjectId(projectId) {
  await ensureProjectExists(projectId);

  const issues = await readIssues();

  return issues
    .filter((i) => i.projectId === projectId)
    .sort((a, b) => {
      const rankA =
        typeof a.rank === "number" ? a.rank : Number.MAX_SAFE_INTEGER;
      const rankB =
        typeof b.rank === "number" ? b.rank : Number.MAX_SAFE_INTEGER;
      return rankA - rankB;
    });
}

module.exports = {
  createIssue,
  listIssues,
  getIssueById,
  updateIssue,
  assignIssueById,
  deleteIssue,
  listIssuesByProjectId,
};