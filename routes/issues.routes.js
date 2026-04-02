const issuesController = require("../controllers/issues.controller");
const commentsController = require("../controllers/comments.controller");
const activityController = require("../controllers/activity.controller");

async function handleIssuesRoutes(req, res, path, url) {
  if (!path.startsWith("/issues")) {
    return false;
  }

  // /issues
  if (path === "/issues") {
    if (req.method === "POST") {
      await issuesController.createIssue(req, res);
      return true;
    }

    if (req.method === "GET") {
      await issuesController.listIssues(req, res, url);
      return true;
    }

    return false;
  }

  // /issues/:id/comments
  const commentsMatch = path.match(/^\/issues\/([^/]+)\/comments$/);
  if (commentsMatch) {
    const issueId = commentsMatch[1];

    if (req.method === "POST") {
      await commentsController.createComment(req, res, issueId);
      return true;
    }

    if (req.method === "GET") {
      await commentsController.listCommentsForIssue(req, res, issueId);
      return true;
    }

    return false;
  }

  // /issues/:id/activity
  const activityMatch = path.match(/^\/issues\/([^/]+)\/activity$/);
  if (activityMatch) {
    const issueId = activityMatch[1];

    if (req.method === "GET") {
      await activityController.getIssueActivity(req, res, issueId);
      return true;
    }

    return false;
  }

  // /issues/:id/assign
  const assignMatch = path.match(/^\/issues\/([^/]+)\/assign$/);
  if (assignMatch) {
    const id = assignMatch[1];

    if (req.method === "PATCH") {
      await issuesController.assignIssue(req, res, id);
      return true;
    }

    return false;
  }

  // /issues/:id
  const match = path.match(/^\/issues\/([^/]+)$/);
  if (match) {
    const id = match[1];

    if (req.method === "GET") {
      await issuesController.getIssueById(req, res, id);
      return true;
    }

    if (req.method === "PATCH") {
      await issuesController.updateIssue(req, res, id);
      return true;
    }

    if (req.method === "DELETE") {
      await issuesController.deleteIssue(req, res, id);
      return true;
    }

    return false;
  }

  return false;
}

module.exports = { handleIssuesRoutes };