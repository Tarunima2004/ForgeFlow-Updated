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

  return false;
}

module.exports = {
  handleDashboardRoutes,
};