const sendJson = require("../utils/sendJson");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");
const { listActivityByEntity } = require("../services/activity.service");

async function getIssueActivity(req, res, issueId) {
  await requireAuth(req);
  requireRole(req, ["admin"]);

  const activity = await listActivityByEntity("issue", issueId);

  return sendJson(res, 200, {
    success: true,
    data: activity,
  });
}

async function getProjectActivity(req, res, projectId) {
  await requireAuth(req);
  requireRole(req, ["admin"]);

  const activity = await listActivityByEntity("project", projectId);

  return sendJson(res, 200, {
    success: true,
    data: activity,
  });
}

module.exports = {
  getIssueActivity,
  getProjectActivity,
};