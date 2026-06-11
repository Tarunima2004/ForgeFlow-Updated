const pool = require("../utils/db");

async function getDashboardStats() {
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
      WHERE status IN ('todo', 'in_progress')
    `);

  const closedIssuesResult =
    await pool.query(`
      SELECT COUNT(*)
      FROM issues
      WHERE status = 'done'
    `);

  const highPriorityResult =
    await pool.query(`
      SELECT COUNT(*)
      FROM issues
      WHERE priority = 'high'
    `);

  const activeUsersResult =
    await pool.query(
      "SELECT COUNT(*) FROM users"
    );

  return {
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
  };
}

async function getIssuesByStatus() {
  const result =
    await pool.query(`
      SELECT
        status,
        COUNT(*)::int AS count
      FROM issues
      GROUP BY status
    `);

  return result.rows;
}

async function getIssuesByPriority() {
  const result =
    await pool.query(`
      SELECT
        priority,
        COUNT(*)::int AS count
      FROM issues
      GROUP BY priority
    `);

  return result.rows;
}

module.exports = {
  getDashboardStats,
  getIssuesByStatus,
  getIssuesByPriority,
};