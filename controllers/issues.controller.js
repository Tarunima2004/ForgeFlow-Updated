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
  requireRole(req.user, ["admin"]);

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
  requireRole(req.user, ["admin"]);

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
  requireRole(req.user, ["admin", "member"]);

  // ✅ Query params
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");
  const assignedTo = url.searchParams.get("assignedTo");
  const q = url.searchParams.get("q"); 

  // ✅ Sorting
  const sort = url.searchParams.get("sort") || "createdAt";
  const order = (url.searchParams.get("order") || "desc").toLowerCase();

  // ✅ Pagination
  const page = parsePage(url.searchParams.get("page"));
  const limit = parseLimit(url.searchParams.get("limit"));

  // ✅ Validation
  if (status) {
    assertOneOf(status, "status", [
      "todo",
      "in_progress",
      "done",
    ]);
  }

  if (priority) {
    assertOneOf(priority, "priority", [
      "low",
      "medium",
      "high",
      "critical",
    ]);
  }

  assertOneOf(sort, "sort", ["createdAt", "updatedAt"]);

  assertOneOf(order, "order", ["asc", "desc"]);

  // ✅ DB-driven querying
  const result = await issuesService.listIssues({
  status,
  q,
  priority,
  assignedTo,
  sort,
  order,
  page,
  limit,
});
  return sendJson(res, 200, result);
}



async function listIssuesForProject(req, res, projectId) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  const issues = await issuesService.listIssuesByProjectId(projectId);

  return sendJson(res, 200, {
    success: true,
    data: issues,
  });
}

async function getIssueById(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  const issue = await issuesService.getIssueById(id);
  return sendJson(res, 200, { success: true, data: issue });
}

async function updateIssue(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

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
  if (body.assignedTo !== undefined) {
  updates.assignedTo = body.assignedTo;
}
  const updated = await issuesService.updateIssue(id, updates, req.user);

  return sendJson(res, 200, { success: true, data: updated });
}

async function assignIssue(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin"]);

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
  requireRole(req.user, ["admin"]);

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