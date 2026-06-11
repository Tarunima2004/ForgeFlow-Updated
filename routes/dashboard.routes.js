const dashboardController =
  require("../controllers/dashboard.controller");

async function handleDashboardRoutes(
  req,
  res,
  path
) {
  if (!path.startsWith("/dashboard")) {
    return false;
  }

  if (
    path === "/dashboard/stats" &&
    req.method === "GET"
  ) {
    await dashboardController.getDashboardStats(
      req,
      res
    );

    return true;
  }

  if (
    path === "/dashboard/issues-by-status" &&
    req.method === "GET"
  ) {
    await dashboardController.getIssuesByStatus(
      req,
      res
    );

    return true;
  }

  if (
    path === "/dashboard/issues-by-priority" &&
    req.method === "GET"
  ) {
    await dashboardController.getIssuesByPriority(
      req,
      res
    );

    return true;
  }

  return false;
}

module.exports = {
  handleDashboardRoutes,
};