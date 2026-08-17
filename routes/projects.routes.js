const projectsController = require("../controllers/projects.controller");
const issuesController = require("../controllers/issues.controller");
const activityController = require("../controllers/activity.controller");

async function handleProjectsRoutes(req, res, path, url) {
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
  // /projects/:projectId/issues
const projectIssuesMatch =
    path.match(/^\/projects\/([^/]+)\/issues$/);

if (projectIssuesMatch) {

    const projectId = projectIssuesMatch[1];

    if (req.method === "POST") {

        await issuesController.createIssueForProject(
            req,
            res,
            projectId
        );

        return true;
    }

    if (req.method === "GET") {

        await issuesController.listProjectIssues(
            req,
            res,
            url,
            projectId
        );
        return true;
    }
    return false;
}
// ========================================
// /projects/:projectId/members
// ========================================
// /projects/:projectId/members/available
const availableMembersMatch =
  path.match(/^\/projects\/([^/]+)\/members\/available$/);

if (availableMembersMatch) {

  const projectId =
    availableMembersMatch[1];

  if (req.method === "GET") {

    await projectsController.getAvailableProjectMembers(
      req,
      res,
      projectId
    );

    return true;
  }

  return false;
}
  // /projects/:id/activity
  const activityMatch = path.match(/^\/projects\/([^/]+)\/activity$/);
  if (activityMatch) {
    const projectId = activityMatch[1];

    if (req.method === "GET") {
      await projectsController.getProjectActivity(req, res, projectId);
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
// /projects/deadlines
if (
  path === "/projects/deadlines" &&
  req.method === "GET"
) {

  await projectsController
    .getUpcomingDeadlines(
      req,
      res
    );

  return true;
}
if (
  path === "/projects/timeline" &&
  req.method === "GET"
) {

  await projectsController
    .getProjectTimeline(
      req,
      res
    );

  return;
}
// /projects/:id/archive
const archiveMatch =
  path.match(
    /^\/projects\/([^/]+)\/archive$/
  );

if (archiveMatch) {

  const projectId =
    archiveMatch[1];

  if (
    req.method === "PATCH"
  ) {

    await projectsController
      .archiveProject(
        req,
        res,
        projectId
      );

    return true;

  }

  return false;

}
if (

  req.method === "GET" &&

  path.match(
    /^\/projects\/([^/]+)\/statistics$/
  )

) {

  const projectId =
    path.split("/")[2];

  return projectsController.getProjectStatistics(

    req,

    res,

    projectId

  );

}
// /projects/my
if (
  path === "/projects/my" &&
  req.method === "GET"
) {

  await projectsController.listUserProjects(
    req,
    res
  );

  return true;

}
if (
  req.method === "GET" &&
  /^\/projects\/[^/]+\/recent-issues$/.test(path)
) {

  const projectId =
    path.split("/")[2];

  await projectsController.getRecentIssues(
    req,
    res,
    projectId
  );

  return true;

}
if (
  req.method === "GET" &&
  /^\/projects\/[^/]+\/health$/.test(path)
) {

  const projectId =
    path.split("/")[2];

  await projectsController.getSingleProjectHealth(
    req,
    res,
    projectId
  );
  return true;

}
if (

  req.method === "GET" &&

  /^\/projects\/[^/]+\/upcoming-deadlines$/.test(path)

) {

  const projectId =
    path.split("/")[2];

  await projectsController.getUpcomingProjectDeadlines(

    req,

    res,

    projectId

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