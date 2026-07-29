const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const { HttpError } = require("../utils/errors");
const { ERROR_CODES } = require("../utils/errors");
const { validate: isUUID } = require("uuid");
const {
  assertRequiredString,
  assertOptionalString,
  assertOptionalStringArray,
  assertOneOf,
  validateIssueType,
  validateLabels,
  validateIssueDates,
  parsePage,
  parseLimit,
} = require("../utils/validators");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

const issuesService = require("../services/issues.service");
const projectsService = require("../services/projects.service");


function parseDueBefore(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, "Invalid dueBefore", "INVALID_DUE_BEFORE");
  }

  return date.toISOString();
}

async function createIssue(req, res) {

  await requireAuth(req);

  requireRole(
    req.user,
    ["admin"]
  );

  const body =
    await readJsonBody(req);

  const title =
    assertRequiredString(
      body.title,
      "title"
    );

  const projectId =
    assertRequiredString(
      body.projectId,
      "projectId"
    );

  const issueType =
    validateIssueType(
      body.issueType || "Task"
    );

  const description =
    assertOptionalString(
      body.description,
      "description"
    );

  const labels =
    validateLabels(
      body.labels
    ) || [];

  const priority =
    body.priority === undefined

      ? undefined

      : assertOneOf(

          body.priority,

          "priority",

          [

            "low",

            "medium",

            "high",

            "critical",

          ]

        );

  const {

    startDate,

    dueDate,

  } = validateIssueDates(

      body.startDate,

      body.dueDate

  );

  const assignedTo =
    body.assignedTo === undefined

      ? undefined

      : assertRequiredString(

          body.assignedTo,

          "assignedTo"

        );

  const issue =
    await issuesService.createIssue(
      {
        title,
        projectId,
        issueType,
        description,
        labels,
        priority,
        startDate,
        dueDate,
        assignedTo,
      },
      req.user
    );
  return sendJson(

    res,
    201,
    {
      success: true,
      data: issue,
    }
  );
}
async function createIssueForProject(req, res, projectId) {
  await requireAuth(req);
  requireRole(req.user, ["admin"]);

  const body = await readJsonBody(req);

const title =
  assertRequiredString(
    body.title,
    "title"
  );

const issueType =
  validateIssueType(
    body.issueType || "Task"
  );

const description =
  assertOptionalString(
    body.description,
    "description"
  );

const labels =
  validateLabels(
    body.labels
  ) || [];

const priority =
  body.priority === undefined
    ? undefined
    : assertOneOf(
        body.priority,
        "priority",
        [
          "low",
          "medium",
          "high",
          "critical",
        ]
      );

const {
  startDate,
  dueDate,
} = validateIssueDates(
  body.startDate,
  body.dueDate
);

const assignedTo =
  body.assignedTo === undefined
    ? undefined
    : assertRequiredString(
        body.assignedTo,
        "assignedTo"
      );
  const parentIssueId =
  body.parentIssueId === undefined
    ? null
    : assertRequiredString(
        body.parentIssueId,
        "parentIssueId"
      );

const issue =
  await issuesService.createIssue(
    {
      title,
      projectId,   
      parentIssueId,      // ← comes from the route parameter
      issueType,
      description,
      labels,
      priority,
      startDate,
      dueDate,
      assignedTo,
    },
    req.user
  );

return sendJson(
  res,
  201,
  {
    success: true,
    data: issue,
  }
);
}
async function listIssues(req, res, url) {

  await requireAuth(req);

  requireRole(
    req.user,
    ["admin", "member"]
  );

  // Query params
  const status =
    url.searchParams.get("status");

  const priority =
    url.searchParams.get("priority");

  const issueType =
    url.searchParams.get("issueType");

  const assignedTo =
    url.searchParams.get("assignedTo");

  const q =
    url.searchParams.get("q");

  const view =
    url.searchParams.get("view");

  // Sorting
  const sort =
    url.searchParams.get("sort") ||
    "createdAt";

  const order =
    (
      url.searchParams.get("order") ||
      "desc"
    ).toLowerCase();

  // Pagination
  const page =
    parsePage(
      url.searchParams.get("page")
    );

  const limit =
    parseLimit(
      url.searchParams.get("limit")
    );

  // Validation

  if (status) {
    assertOneOf(
      status,
      "status",
      [
        "backlog",
        "todo",
        "in_progress",
        "done",
      ]
    );
  }

  if (priority) {
    assertOneOf(
      priority,
      "priority",
      [
        "low",
        "medium",
        "high",
        "critical",
      ]
    );
  }

  if (issueType) {
    assertOneOf(
      issueType,
      "issueType",
      [
        "Epic",
        "Story",
        "Task",
        "Bug",
        "Improvement",
      ]
    );
  }

  assertOneOf(
    sort,
    "sort",
    [
      "createdAt",
      "updatedAt",
    ]
  );

  assertOneOf(
    order,
    "order",
    [
      "asc",
      "desc",
    ]
  );

  const result =
    await issuesService.listIssues({

      user: req.user,

      status,

      priority,

      issueType,

      assignedTo,

      q,

      sort,

      order,

      page,

      limit,

      view,

    });

  return sendJson(
    res,
    200,
    result
  );

}
async function listProjectIssues(req, res, url, projectId) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  // ✅ Validate project ID format
  if (!isUUID(projectId)) {
    return sendJson(res, 400, {
      success: false,
      error: {
        message: "Invalid project ID.",
        code: "VALIDATION_ERROR",
      },
    });
  }

  // ✅ Query params
  const status = url.searchParams.get("status");
  const priority = url.searchParams.get("priority");
  const issueType = url.searchParams.get("issueType");
  const assignedTo = url.searchParams.get("assignedTo");
  const q = url.searchParams.get("q");
  const view = url.searchParams.get("view");

  // ✅ Sorting
  const sort = url.searchParams.get("sort") || "createdAt";
  const order = (url.searchParams.get("order") || "desc").toLowerCase();

  // ✅ Pagination
  const page = parsePage(url.searchParams.get("page"));
  const limit = parseLimit(url.searchParams.get("limit"));

  // ✅ Validation
  if (status) {
    assertOneOf(status, "status", [
      "backlog",
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

  if (issueType) {
    assertOneOf(issueType, "issueType", [
      "Epic",
      "Story",
      "Task",
      "Bug",
      "Improvement",
    ]);
  }

  assertOneOf(sort, "sort", ["createdAt", "updatedAt"]);
  assertOneOf(order, "order", ["asc", "desc"]);

  // ✅ Ensure project exists
  try {
    await projectsService.getProjectById(projectId);
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) {
      return sendJson(res, 404, {
        success: false,
        error: {
          message: err.message,
          code: err.code,
        },
      });
    }

    throw err;
  }

  // ✅ Fetch project issues
  const result = await issuesService.listProjectIssues(projectId, {
    status,
    priority,
    issueType,
    assignedTo,
    q,
    sort,
    order,
    page,
    limit,
    view,
  });

  return sendJson(res, 200, result);
}
async function getIssueById(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  if (!isUUID(id)) {
    throw new HttpError(
      400,
      "Invalid issue ID.",
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  const issue = await issuesService.getIssueDetails(id);

  return sendJson(res, 200, {
    success: true,
    data: issue,
  });
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
      "backlog",
      "todo",
      "in_progress",
      "done",
    ]);
  }

  if (body.labels !== undefined) {
    updates.labels =
  validateLabels(
    body.labels
  );
  }

  if (body.priority !== undefined) {
    updates.priority = assertOneOf(body.priority, "priority", [
      "low",
      "medium",
      "high",
      "critical",
    ]);
  }

  if (

  body.startDate !== undefined ||

  body.dueDate !== undefined

) {

  const {

    startDate,

    dueDate,

  } = validateIssueDates(

      body.startDate,

      body.dueDate

  );

  updates.startDate =
    startDate;

  updates.dueDate =
    dueDate;

}
  if (body.assignedTo !== undefined) {
  updates.assignedTo = body.assignedTo;
}
if (body.issueType !== undefined) {

  updates.issueType =
    validateIssueType(
      body.issueType
    );

}
if (body.description !== undefined) {

  updates.description =
    assertOptionalString(
      body.description,
      "description"
    );

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
async function reorderIssue(req, res) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  const body = await readJsonBody(req);

  if (!Array.isArray(body.issues)) {
    throw new HttpError(
      400,
      "issues must be an array",
      "INVALID_ISSUES_PAYLOAD"
    );
  }

  const updated =
    await issuesService.reorderIssues(
      body.issues,
      req.user
    );

  return sendJson(res, 200, {
    success: true,
    data: updated,
  });
}
async function deleteIssue(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin"]);

  const deleted = await issuesService.deleteIssue(id);
  return sendJson(res, 200, { success: true, data: deleted });
}

async function getIssueKPIsController(
  req,
  res
) {
  try {

    const data =
       await issuesService.getIssueKPIs();

    sendJson(
      res,
      200,
      {
        success: true,
        data,
      }
    );

  } catch (error) {

    sendJson(
      res,
      500,
      {
        success: false,
        message:
          error.message,
      }
    );

  }
}
async function getDashboardStats(req, res) {

  const user = await requireAuth(req);

  requireRole(user, [
    "admin",
    "member",
  ]);

  const stats =
    await issuesService.getMyDashboardStats(
      user.id
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: stats,
    }
  );
}
async function getTaskDistribution(req, res) {

  const user = await requireAuth(req);

  requireRole(user, [
    "admin",
    "member",
  ]);

  const distribution =
    await issuesService.getTaskDistribution(
      user.id
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: distribution,
    }
  );

}
async function getIssueDetails(req, res) {

    const issue = await issuesService.getIssueDetails(
        req.params.id
    );

    sendJson(
        res,
        200,
        issue
    );
}
async function getMyIssues(req, res) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  const issues = await issuesService.getMyIssues(
    req.user.id
  );

  return sendJson(res, 200, {
    success: true,
    data: issues,
  });
}
module.exports = {
  createIssue,
  createIssueForProject,
  listIssues,
  listProjectIssues,
  getIssueById,
  updateIssue,
  assignIssue,
  reorderIssue,
  deleteIssue,
  getIssueKPIsController,
  getDashboardStats,
  getTaskDistribution,
  getIssueDetails,
  getMyIssues,
};