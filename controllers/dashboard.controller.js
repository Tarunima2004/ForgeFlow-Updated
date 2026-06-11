const sendJson = require("../utils/sendJson");

const dashboardService =
  require("../services/dashboard.service");

async function getDashboardStats(
  req,
  res
) {
  try {

    const data =
      await dashboardService
        .getDashboardStats();

    return sendJson(res, 200, {
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    return sendJson(res, 500, {
      success: false,
      message:
        "Failed to fetch dashboard stats",
    });
  }
}

async function getIssuesByStatus(
  req,
  res
) {
  try {

    const data =
      await dashboardService
        .getIssuesByStatus();

    return sendJson(res, 200, {
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    return sendJson(res, 500, {
      success: false,
      message:
        "Failed to fetch issues by status",
    });
  }
}

async function getIssuesByPriority(
  req,
  res
) {
  try {

    const data =
      await dashboardService
        .getIssuesByPriority();

    return sendJson(res, 200, {
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    return sendJson(res, 500, {
      success: false,
      message:
        "Failed to fetch issues by priority",
    });
  }
}

module.exports = {
  getDashboardStats,
  getIssuesByStatus,
  getIssuesByPriority,
};