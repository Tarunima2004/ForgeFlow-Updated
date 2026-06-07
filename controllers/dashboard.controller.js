const sendJson = require("../utils/sendJson");
const pool = require("../utils/db");

async function getDashboardStats(req, res) {
  try {
    const totalProjectsResult =
      await pool.query(
        "SELECT COUNT(*) FROM projects"
      );

    const totalIssuesResult =
      await pool.query(
        "SELECT COUNT(*) FROM issues"
      );

    const openIssuesResult =
  await pool.query(`
    SELECT COUNT(*)
    FROM issues
    WHERE status IN ('todo', 'in progress')
  `);
    const closedIssuesResult =
  await pool.query(`
    SELECT COUNT(*)
    FROM issues
    WHERE status = 'done'
  `);

    const highPriorityResult =
      await pool.query(
        "SELECT COUNT(*) FROM issues WHERE priority = 'high'"
      );

    const activeUsersResult =
      await pool.query(
        "SELECT COUNT(*) FROM users"
      );

    return sendJson(res, 200, {
      success: true,
      data: {
        totalProjects:
          Number(totalProjectsResult.rows[0].count),

        totalIssues:
          Number(totalIssuesResult.rows[0].count),

        openIssues:
          Number(openIssuesResult.rows[0].count),

        closedIssues:
          Number(closedIssuesResult.rows[0].count),

        highPriorityIssues:
          Number(highPriorityResult.rows[0].count),

        activeUsers:
          Number(activeUsersResult.rows[0].count),
      },
    });
  } catch (error) {
    console.error(error);

    return sendJson(res, 500, {
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
}

module.exports = {
  getDashboardStats,
};