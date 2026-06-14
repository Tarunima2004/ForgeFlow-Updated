const projectsController = require("../controllers/projects.controller");
const issuesController = require("../controllers/issues.controller");
const activityController = require("../controllers/activity.controller");

async function handleProjectsRoutes(req, res, path) {
  if (!path.startsWith("/projects")) {
    return false;
  }

  console.log("INSIDE handleProjectsRoutes =>", req.method, path);

  // /projects
  if (path === "/projects") {
    if (req.method === "POST") {
      await projectsController.createProject(req, res);
      return true;
    }

    if (req.method === "GET") {
      await projectsController.listProjects(req, res);
      return true;
    }

    return false;
  }
// /projects/stats
if (
  path === "/projects/stats" &&
  req.method === "GET"
) {

  await projectsController.getProjectStats(
    req,
    res
  );

  return true;
}
  // /projects/:id/issues
  const issuesMatch = path.match(/^\/projects\/([^/]+)\/issues$/);
  if (issuesMatch) {
    const projectId = issuesMatch[1];

    if (req.method === "POST") {
      await issuesController.createIssueForProject(req, res, projectId);
      return true;
    }

    if (req.method === "GET") {
      await issuesController.listIssuesForProject(req, res, projectId);
      return true;
    }

    return false;
  }

  // /projects/:id/activity
  const activityMatch = path.match(/^\/projects\/([^/]+)\/activity$/);
  if (activityMatch) {
    const projectId = activityMatch[1];

    if (req.method === "GET") {
      await activityController.getProjectActivity(req, res, projectId);
      return true;
    }

    return false;
  }

  // /projects/:id/summary
  const summaryMatch = path.match(/^\/projects\/([^/]+)\/summary$/);
  if (summaryMatch) {
    const projectId = summaryMatch[1];

    if (req.method === "GET") {
      await projectsController.getProjectSummary(req, res, projectId);
      return true;
    }

    return false;
  }
  if (
  path === "/projects/insights" &&
  req.method === "GET"
) {
  await projectsController.getProjectInsights(
    req,
    res
  );

  return true;
}
// /projects/health
if (
  path === "/projects/health" &&
  req.method === "GET"
) {

  await projectsController
    .getProjectHealth(
      req,
      res
    );

  return true;
}
  // /projects/:id
  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const id = projectMatch[1];

    if (req.method === "GET") {
      await projectsController.getProject(req, res, id);
      return true;
    }

    if (req.method === "PATCH") {
      await projectsController.patchProject(req, res, id);
      return true;
    }

    if (req.method === "DELETE") {
      await projectsController.deleteProject(req, res, id);
      return true;
    }

    return false;
  }

  return false;
}

module.exports = { handleProjectsRoutes };