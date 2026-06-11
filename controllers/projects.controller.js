const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const { assertRequiredString } = require("../utils/validators");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

const projectsService = require("../services/projects.service");

async function createProject(req, res) {
  await requireAuth(req);
  requireRole(req.user, ["admin"]);

  const body = await readJsonBody(req);
  const name = assertRequiredString(body.name, "name");

  const project = await projectsService.createProject(
    {
      name,
    },
    req.user
  );

  return sendJson(res, 201, { success: true, data: project });
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

async function patchProject(req, res, id) {
  await requireAuth(req);
  requireRole(req.user, ["admin"]);

  const body = await readJsonBody(req);

  const updates = {};

  if (body.name !== undefined) {
    updates.name = assertRequiredString(body.name, "name");
  }

  const project = await projectsService.updateProjectById(id, updates, req.user);

  return sendJson(res, 200, {
    success: true,
    data: project,
  });
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

module.exports = {
  createProject,
  listProjects,
  getProject,
  getProjectSummary,
  patchProject,
  deleteProject,
  getProjectStats,
  getProjectInsights,
};