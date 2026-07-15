const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const { assertRequiredString } = require("../utils/validators");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

const projectsService = require("../services/projects.service");

async function createProject(req, res) {

  await requireAuth(req);

  requireRole(
    req.user,
    ["admin"]
  );

  const body =
    await readJsonBody(req);
  const project = await projectsService.createProject(
    {
      project_name:
        assertRequiredString(
          body.project_name,
          "project_name"
        ),

      project_code:
        assertRequiredString(
          body.project_code,
          "project_code"
        ),

      description:
        body.description,

      project_team:
  Array.isArray(body.project_team)
    ? body.project_team
    : [],

      status:
        body.status,

      priority:
        body.priority,

      start_date:
        body.start_date,

      end_date:
        body.end_date,

      estimated_completion:
        body.estimated_completion,

      actual_completion:
        body.actual_completion,

      visibility:
        body.visibility,

      allow_time_tracking:
        body.allow_time_tracking,

      allow_comments:
        body.allow_comments,

      allow_file_uploads:
        body.allow_file_uploads,
        
    },

    req.user
  );

  return sendJson(
    res,
    201,
    {
      success: true,
      data: project,
    }
  );
}
async function listProjects(req, res) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  const projects = await projectsService.listProjects();

  return sendJson(res, 200, {
    success: true,
    data: projects,
  });
}
async function listUserProjects(req, res) {

  await requireAuth(req);

  requireRole(
    req.user,
    ["admin", "member"]
  );

  const projects =
    await projectsService.listUserProjects(
      req.user.id
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: projects,
    }
  );

}

async function getProject(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  const project = await projectsService.getProjectById(id);

  return sendJson(res, 200, {
    success: true,
    data: project,
  });
}

async function getProjectSummary(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin", "member"]);

  const summary = await projectsService.getProjectSummaryById(id);

  return sendJson(res, 200, {
    success: true,
    data: summary,
  });
}

async function patchProject(
  req,
  res,
  id
) {

  await requireAuth(req);

  requireRole(
    req.user,
    ["admin"]
  );

  const body =
    await readJsonBody(req);

  const updates = {};

  if (
    body.project_name !== undefined
  ) {
    updates.project_name =
      assertRequiredString(
        body.project_name,
        "project_name"
      );
  }

  if (
    body.project_code !== undefined
  ) {
    updates.project_code =
      body.project_code;
  }

  if (
    body.description !== undefined
  ) {
    updates.description =
      body.description;
  }

  if (
    body.project_manager !== undefined
  ) {
    updates.project_manager =
      body.project_manager;
  }

  if (
    body.status !== undefined
  ) {
    updates.status =
      body.status;
  }

  if (
    body.priority !== undefined
  ) {
    updates.priority =
      body.priority;
  }

  if (
    body.start_date !== undefined
  ) {
    updates.start_date =
      body.start_date;
  }

  if (
    body.end_date !== undefined
  ) {
    updates.end_date =
      body.end_date;
  }

  if (
    body.estimated_completion !== undefined
  ) {
    updates.estimated_completion =
      body.estimated_completion;
  }

  if (
    body.actual_completion !== undefined
  ) {
    updates.actual_completion =
      body.actual_completion;
  }

  if (
    body.visibility !== undefined
  ) {
    updates.visibility =
      body.visibility;
  }

  if (
    body.allow_time_tracking !== undefined
  ) {
    updates.allow_time_tracking =
      body.allow_time_tracking;
  }

  if (
    body.allow_comments !== undefined
  ) {
    updates.allow_comments =
      body.allow_comments;
  }

  if (
    body.allow_file_uploads !== undefined
  ) {
    updates.allow_file_uploads =
      body.allow_file_uploads;
  }

  const project =
    await projectsService.updateProjectById(
      id,
      updates,
      req.user
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: project,
    }
  );
}
async function archiveProject(
  req,
  res,
  id
) {

  await requireAuth(req);

  requireRole(
    req.user,
    ["admin"]
  );

  const project =
    await projectsService
      .archiveProjectById(
        id,
        req.user
      );

  return sendJson(
    res,
    200,
    {
      success: true,
      message:
        "Project archived successfully",
      data: project,
    }
  );

}
async function deleteProject(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin"]);

  const result = await projectsService.deleteProjectById(id);

  return sendJson(res, 200, {
    success: true,
    message: "Project deleted successfully",
    data: {
      project: result.deletedProject,
      deletedIssuesCount: result.deletedIssuesCount,
    },
  });
}
async function getProjectStats(
  req,
  res
) {

  const stats =
    await projectsService
      .getProjectStats();

  return sendJson(
    res,
    200,
    {
      success: true,
      data: stats,
    }
  );
}
async function getProjectInsights(req, res) {
  const insights =
    await projectsService.getProjectInsights();

  return sendJson(res, 200, {
    success: true,
    data: insights,
  });
}
async function getProjectHealth(
  req,
  res
) {
  const data =
    await projectsService
      .getProjectHealth();

  return sendJson(
    res,
    200,
    {
      success: true,
      data,
    }
  );
}
async function getUpcomingDeadlines(
  req,
  res
) {

  const data =
    await projectsService
      .getUpcomingDeadlines();

  return sendJson(
    res,
    200,
    {
      success: true,
      data,
    }
  );
}
async function getProjectTimeline(
  req,
  res
) {

  const data =
    await projectsService
      .getProjectTimeline();

  return sendJson(
    res,
    200,
    {
      success: true,
      data,
    }
  );
}
async function getProjectStatistics(
  req,
  res,
  projectId
) {

  await requireAuth(req);

  const statistics =
    await projectsService.getProjectStatistics(
      projectId
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: statistics,
    }
  );
}
async function getTaskDistribution(req, res) {

  const user =
    await requireAuth(req);

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
module.exports = {
  createProject,
  listProjects,
  listUserProjects,
  getProject,
  getProjectSummary,
  patchProject,
  deleteProject,
  getProjectStats,
  getProjectInsights,
  getProjectHealth,
  getUpcomingDeadlines,
  getProjectTimeline,
  archiveProject,
  getProjectStatistics,
  getTaskDistribution,
};