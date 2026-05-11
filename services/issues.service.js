const crypto = require("crypto");
const pool = require("../utils/db");
const { assertFound } = require("../utils/errors");
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
  if (validated === undefined || validated === null) return null;
  return new Date(validated).toISOString();
}

function validateAssignedTo(assignedTo) {
  const a = assertRequiredString(assignedTo, "assignedTo");
  return assertMinLength(a, "assignedTo", 2);
}

// ✅ Ensure project exists (DB version)
async function ensureProjectExists(projectId) {
  console.log("PROJECT ID CHECK:", projectId); // ✅ ADDED

  const result = await pool.query(
    "SELECT id FROM projects WHERE id = $1",
    [projectId]
  );

  console.log("DB RESULT:", result.rows); // ✅ ADDED

  assertFound(result.rows[0], "Project not found");
}
// ✅ Get next rank (DB version)
async function getNextRankForProject(projectId) {
  const result = await pool.query(
    "SELECT MAX(rank) as max_rank FROM issues WHERE project_id = $1",
    [projectId]
  );

  const max = result.rows[0].max_rank;
  return max ? max + 1 : 1;
}
// ✅ Create issue
async function createIssue(
  { title, projectId = null, labels = [], priority, dueDate, assignedTo },
  currentUser
) {
  console.log("BODY RECEIVED:", { title, projectId }); // ✅ ADDED

  if (projectId) {
    projectId = projectId.trim(); // ✅ ADDED (fix hidden space bug)
    await ensureProjectExists(projectId);
  }
  const now = new Date().toISOString();
  const userId = currentUser.id;

  const rank = projectId ? await getNextRankForProject(projectId) : null;

  const result = await pool.query(
    `INSERT INTO issues
     (id, title, project_id, status, priority, due_date, rank, assigned_to, created_by, updated_by, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING *`,
    [
      crypto.randomUUID(),
      validateTitle(title),
      projectId,
      "todo",
      validatePriority(priority),
      validateDueDate(dueDate),
      rank,
      assignedTo !== undefined ? validateAssignedTo(assignedTo) : null,
      userId,
      userId,
      now,
      now,
    ]
  );

  const issue = result.rows[0];

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
  const result = await pool.query("SELECT * FROM issues");
  return result.rows;
}

// ✅ Get issue by id
async function getIssueById(id) {
  const result = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [id]
  );

  const issue = result.rows[0];
  assertFound(issue, "Issue not found");

  return issue;
}

// ✅ Update issue
async function updateIssue(
  id,
  { title, status, labels, priority, dueDate, assignedTo },
  currentUser
) {
  const existing = await getIssueById(id);

  const oldStatus = existing.status;
  const nextStatus =
    status !== undefined
      ? (assertAllowedStatus(status), status)
      : existing.status;

  const updated = await pool.query(
    `UPDATE issues SET
     title = $1,
     status = $2,
     priority = $3,
     due_date = $4,
     assigned_to = $5,
     updated_by = $6,
     updated_at = $7
     WHERE id = $8
     RETURNING *`,
    [
      title !== undefined ? validateTitle(title) : existing.title,
      nextStatus,
      priority !== undefined
        ? validatePriority(priority)
        : existing.priority || "medium",
      dueDate !== undefined
        ? validateDueDate(dueDate)
        : existing.due_date || null,
      assignedTo !== undefined
        ? assignedTo === null
          ? null
          : validateAssignedTo(assignedTo)
        : existing.assigned_to,
      currentUser.id,
      new Date().toISOString(),
      id,
    ]
  );

  const updatedIssue = updated.rows[0];

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
  const updated = await pool.query(
    `UPDATE issues SET
     assigned_to = $1,
     updated_by = $2,
     updated_at = $3
     WHERE id = $4
     RETURNING *`,
    [
      validateAssignedTo(assignedTo),
      currentUser.id,
      new Date().toISOString(),
      id,
    ]
  );

  const issue = updated.rows[0];
  assertFound(issue, "Issue not found");

  await logActivity({
    entityType: "issue",
    entityId: issue.id,
    action: "issue_assigned",
    message: `Issue assigned to ${issue.assigned_to}`,
  });

  return issue;
}

// ✅ Delete issue
async function deleteIssue(id) {
  const result = await pool.query(
    "DELETE FROM issues WHERE id = $1 RETURNING *",
    [id]
  );

  const issue = result.rows[0];
  assertFound(issue, "Issue not found");

  await logActivity({
    entityType: "issue",
    entityId: issue.id,
    action: "issue_deleted",
    message: `Issue "${issue.title}" deleted`,
  });

  return issue;
}

// ✅ List issues by project (sorted by rank)
async function listIssuesByProjectId(projectId) {
  await ensureProjectExists(projectId);

  const result = await pool.query(
    `SELECT * FROM issues
     WHERE project_id = $1
     ORDER BY rank ASC NULLS LAST`,
    [projectId]
  );

  return result.rows;
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