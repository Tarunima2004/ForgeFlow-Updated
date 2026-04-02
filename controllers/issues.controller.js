const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const { HttpError } = require("../utils/errors");
const {
  assertRequiredString,
  assertOptionalString,
  assertOptionalStringArray,
  assertOneOf,
  parsePage,
  parseLimit,
} = require("../utils/validators");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

const issuesService = require("../services/issues.service");

function parseDueBefore(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, "Invalid dueBefore", "INVALID_DUE_BEFORE");
  }

  return date.toISOString();
}

async function createIssue(req, res) {
  await requireAuth(req);
  requireRole(req, ["admin"]);

  const body = await readJsonBody(req);

  const title = assertRequiredString(body.title, "title");
  const projectId =
    body.projectId === undefined || body.projectId === null
      ? null
      : assertOptionalString(body.projectId, "projectId");
  const labels = assertOptionalStringArray(body.labels, "labels") || [];
  const priority =
    body.priority === undefined
      ? undefined
      : assertOneOf(body.priority, "priority", [
          "low",
          "medium",
          "high",
          "critical",
        ]);
  const dueDate = body.dueDate;
  const assignedTo =
    body.assignedTo === undefined ? undefined : assertRequiredString(body.assignedTo, "assignedTo");

  const issue = await issuesService.createIssue(
    {
      title,
      projectId,
      labels,
      priority,
      dueDate,
      assignedTo,
    },
    req.user
  );

  return sendJson(res, 201, { success: true, data: issue });
}

async function createIssueForProject(req, res, projectId) {
  await requireAuth(req);
  requireRole(req, ["admin"]);

  const body = await readJsonBody(req);

  const title = assertRequiredString(body.title, "title");
  const labels = assertOptionalStringArray(body.labels, "labels") || [];
  const priority =
    body.priority === undefined
      ? undefined
      : assertOneOf(body.priority, "priority", [
          "low",
          "medium",
          "high",
          "critical",
        ]);
  const dueDate = body.dueDate;
  const assignedTo =
    body.assignedTo === undefined ? undefined : assertRequiredString(body.assignedTo, "assignedTo");

  const issue = await issuesService.createIssue(
    {
      title,
      projectId,
      labels,
      priority,
      dueDate,
      assignedTo,
    },
    req.user
  );

  return sendJson(res, 201, { success: true, data: issue });
}

async function listIssues(req, res, url) {
  await requireAuth(req);
  requireRole(req, ["admin", "member"]);

  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q");
  const label = url.searchParams.get("label");
  const priority = url.searchParams.get("priority");
  const overdue = url.searchParams.get("overdue");
  const dueBefore = url.searchParams.get("dueBefore");
  const assignedTo = url.searchParams.get("assignedTo");

  const sort = url.searchParams.get("sort") || "createdAt";
  const order = (url.searchParams.get("order") || "desc").toLowerCase();

  const page = parsePage(url.searchParams.get("page"));
  const limit = parseLimit(url.searchParams.get("limit"));

  let issues = await issuesService.listIssues();

  if (status) {
    assertOneOf(status, "status", ["todo", "in_progress", "done"]);
    issues = issues.filter((i) => i.status === status);
  }

  if (q) {
    const needle = q.trim().toLowerCase();
    issues = issues.filter((i) => i.title.toLowerCase().includes(needle));
  }

  if (label) {
    const wantedLabels = label
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    issues = issues.filter((i) => {
      const issueLabels = Array.isArray(i.labels)
        ? i.labels.map((item) => String(item).trim().toLowerCase())
        : [];

      return wantedLabels.every((wanted) => issueLabels.includes(wanted));
    });
  }

  if (priority) {
    const normalizedPriority = assertOneOf(priority, "priority", [
      "low",
      "medium",
      "high",
      "critical",
    ]);

    issues = issues.filter(
      (i) => (i.priority || "medium") === normalizedPriority
    );
  }

  if (overdue) {
    const normalizedOverdue = assertOneOf(overdue, "overdue", ["true", "false"]);

    if (normalizedOverdue === "true") {
      const now = new Date();

      issues = issues.filter((i) => {
        if (!i.dueDate) return false;

        const due = new Date(i.dueDate);
        if (Number.isNaN(due.getTime())) return false;

        return due < now && i.status !== "done";
      });
    }
  }

  if (dueBefore) {
    const dueBeforeDate = new Date(parseDueBefore(dueBefore));

    issues = issues.filter((i) => {
      if (!i.dueDate) return false;

      const due = new Date(i.dueDate);
      if (Number.isNaN(due.getTime())) return false;

      return due <= dueBeforeDate;
    });
  }

  if (assignedTo) {
    const normalizedAssignedTo = assignedTo.trim().toLowerCase();

    if (normalizedAssignedTo === "unassigned") {
      issues = issues.filter(
        (i) => !i.assignedTo || i.assignedTo.trim() === ""
      );
    } else {
      issues = issues.filter(
        (i) =>
          typeof i.assignedTo === "string" &&
          i.assignedTo.trim().toLowerCase() === normalizedAssignedTo
      );
    }
  }

  assertOneOf(sort, "sort", ["createdAt", "updatedAt"]);
  assertOneOf(order, "order", ["asc", "desc"]);

  issues.sort((a, b) => {
    const av = a[sort];
    const bv = b[sort];

    if (av === bv) return 0;

    const cmp = av < bv ? -1 : 1;
    return order === "asc" ? cmp : -cmp;
  });

  const total = issues.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = issues.slice(start, start + limit);

  return sendJson(res, 200, {
    success: true,
    meta: { page, limit, total, totalPages },
    data,
  });
}

async function listIssuesForProject(req, res, projectId) {
  await requireAuth(req);
  requireRole(req, ["admin", "member"]);

  const issues = await issuesService.listIssuesByProjectId(projectId);

  return sendJson(res, 200, {
    success: true,
    data: issues,
  });
}

async function getIssueById(req, res, id) {
  await requireAuth(req);
  requireRole(req, ["admin", "member"]);

  const issue = await issuesService.getIssueById(id);
  return sendJson(res, 200, { success: true, data: issue });
}

async function updateIssue(req, res, id) {
  await requireAuth(req);
  requireRole(req, ["admin", "member"]);

  const body = await readJsonBody(req);

  const updates = {};

  if (body.title !== undefined) {
    updates.title = assertRequiredString(body.title, "title");
  }

  if (body.status !== undefined) {
    updates.status = assertOneOf(body.status, "status", [
      "todo",
      "in_progress",
      "done",
    ]);
  }

  if (body.labels !== undefined) {
    updates.labels = assertOptionalStringArray(body.labels, "labels");
  }

  if (body.priority !== undefined) {
    updates.priority = assertOneOf(body.priority, "priority", [
      "low",
      "medium",
      "high",
      "critical",
    ]);
  }

  if (body.dueDate !== undefined) {
    updates.dueDate = body.dueDate;
  }

  const updated = await issuesService.updateIssue(id, updates, req.user);

  return sendJson(res, 200, { success: true, data: updated });
}

async function assignIssue(req, res, id) {
  await requireAuth(req);
  requireRole(req, ["admin"]);

  const body = await readJsonBody(req);

  const assignedTo = assertRequiredString(body.assignedTo, "assignedTo");

  const updated = await issuesService.assignIssueById(
    id,
    {
      assignedTo,
    },
    req.user
  );

  return sendJson(res, 200, { success: true, data: updated });
}

async function deleteIssue(req, res, id) {
  await requireAuth(req);
  requireRole(req, ["admin"]);

  const deleted = await issuesService.deleteIssue(id);
  return sendJson(res, 200, { success: true, data: deleted });
}

module.exports = {
  createIssue,
  createIssueForProject,
  listIssues,
  listIssuesForProject,
  getIssueById,
  updateIssue,
  assignIssue,
  deleteIssue,
};