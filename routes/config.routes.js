const {
  getDepartments,
  getJobRolesByDepartment,
} = require("../config/jobRoles");

const sendJson = require("../utils/sendJson");

function handleConfigRoutes(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // -----------------------------
  // GET /config/departments
  // -----------------------------
  if (
    req.method === "GET" &&
    url.pathname === "/config/departments"
  ) {
    return sendJson(res, 200, {
      success: true,
      data: getDepartments(),
    });
  }

  // -----------------------------
  // GET /config/job-roles
  // -----------------------------
  if (
    req.method === "GET" &&
    url.pathname === "/config/job-roles"
  ) {
    const department =
      url.searchParams.get("department");

    return sendJson(res, 200, {
      success: true,
      data: getJobRolesByDepartment(department),
    });
  }

  return false;
}

module.exports = {
  handleConfigRoutes,
};