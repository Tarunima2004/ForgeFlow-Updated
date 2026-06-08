const sendJson = require("../utils/sendJson");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

const {
  listActivityByEntity,
  listRecentActivity,
} = require("../services/activity.service");

async function getIssueActivity(
  req,
  res,
  issueId
) {
  const user =
    await requireAuth(req);

  requireRole(user, [
    "admin",
  ]);

  const activity =
    await listActivityByEntity(
      "issue",
      issueId
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: activity,
    }
  );
}

async function getProjectActivity(
  req,
  res,
  projectId
) {
  const user =
    await requireAuth(req);

  requireRole(user, [
    "admin",
  ]);

  const activity =
    await listActivityByEntity(
      "project",
      projectId
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: activity,
    }
  );
}

async function getRecentActivity(
  req,
  res
) {
  const user =
    await requireAuth(req);

  requireRole(user, [
    "admin",
    "member",
  ]);

  const activity =
    await listRecentActivity(
      10
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: activity,
    }
  );
}

module.exports = {
  getIssueActivity,
  getProjectActivity,
  getRecentActivity,
};