const activityController =
  require(
    "../controllers/activity.controller"
  );

async function handleActivityRoutes(
  req,
  res,
  path
) {

  if (
    path === "/activity"
  ) {

    if (
      req.method === "GET"
    ) {

      await activityController.getRecentActivity(
        req,
        res
      );

      return true;
    }
  }

  return false;
}

module.exports = {
  handleActivityRoutes,
};