const crypto = require("crypto");
const pool = require("../utils/db");
const { HttpError, assertFound } = require("../utils/errors");
const { getUserSnapshot } = require("../utils/authUserSnapshot");
const { logActivity } = require("./activity.service");

function validateName(name) {
  const n = (name || "").trim();

  if (!n) {
    throw new HttpError(400, "name is required", "VALIDATION_ERROR");
  }

  if (n.length < 3) {
    throw new HttpError(400, "name must be at least 3 chars", "VALIDATION_ERROR");
  }

  return n;
}

// ✅ CREATE PROJECT
async function createProject({ name }, currentUser) {
  const now = new Date().toISOString();
  const userId = currentUser.id;

  const result = await pool.query(
    `INSERT INTO projects (id, name, created_by, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [crypto.randomUUID(), validateName(name), userId, now, now]
  );

  const project = result.rows[0];

  await logActivity({
    entityType: "project",
    entityId: project.id,
    action: "project_created",
    message: `Project "${project.name}" created`,
  });

  return project;
}

// ✅ LIST PROJECTS
async function listProjects() {
  const result = await pool.query("SELECT * FROM projects");
  return result.rows;
}

// ✅ GET PROJECT BY ID
async function getProjectById(id) {
  const result = await pool.query(
    "SELECT * FROM projects WHERE id = $1",
    [id]
  );

  const project = result.rows[0];
  assertFound(project, "Project not found");

  return project;
}

// ✅ PROJECT SUMMARY (converted logic)
async function getProjectSummaryById(id) {
  const project = await getProjectById(id);

  const result = await pool.query(
    "SELECT * FROM issues WHERE project_id = $1",
    [id]
  );

  const projectIssues = result.rows;

  const statusBreakdown = {
    todo: 0,
    in_progress: 0,
    done: 0,
  };

  const priorityBreakdown = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  let overdueIssues = 0;
  const now = new Date();

  for (const issue of projectIssues) {
    if (statusBreakdown[issue.status] !== undefined) {
      statusBreakdown[issue.status] += 1;
    }

    const priority = issue.priority || "medium";
    if (priorityBreakdown[priority] !== undefined) {
      priorityBreakdown[priority] += 1;
    }

    if (
      issue.due_date &&
      new Date(issue.due_date) < now &&
      issue.status !== "done"
    ) {
      overdueIssues += 1;
    }
  }

  return {
    projectId: project.id,
    projectName: project.name,
    totalIssues: projectIssues.length,
    statusBreakdown,
    priorityBreakdown,
    overdueIssues,
  };
}

// ✅ UPDATE PROJECT
async function updateProjectById(id, { name }, currentUser) {
  const result = await pool.query(
    `UPDATE projects
     SET name = $1, updated_at = $2
     WHERE id = $3
     RETURNING *`,
    [validateName(name), new Date().toISOString(), id]
  );

  const updatedProject = result.rows[0];
  assertFound(updatedProject, "Project not found");

  await logActivity({
    entityType: "project",
    entityId: updatedProject.id,
    action: "project_updated",
    message: `Project renamed to "${updatedProject.name}"`,
  });

  return updatedProject;
}

// ✅ DELETE PROJECT (DB handles cascade)
async function deleteProjectById(id) {
  // Count issues before delete (for response)
  const issuesResult = await pool.query(
    "SELECT COUNT(*) FROM issues WHERE project_id = $1",
    [id]
  );

  const deletedIssuesCount = parseInt(issuesResult.rows[0].count, 10);

  const result = await pool.query(
    "DELETE FROM projects WHERE id = $1 RETURNING *",
    [id]
  );

  const project = result.rows[0];
  assertFound(project, "Project not found");

  await logActivity({
    entityType: "project",
    entityId: project.id,
    action: "project_deleted",
    message: `Project "${project.name}" deleted`,
  });

  return {
    deletedProject: project,
    deletedIssuesCount,
  };
}

module.exports = {
  createProject,
  listProjects,
  getProjectById,
  getProjectSummaryById,
  updateProjectById,
  deleteProjectById,
};