const crypto = require("crypto");
const { HttpError, assertFound } = require("../utils/errors");
const {
  readProjects,
  writeProjects,
  readIssues,
  writeIssues,
} = require("../utils/fileDb");
const { getUserSnapshot } = require("../utils/authUserSnapshot");
const { logActivity } = require("./activity.service");

function validateName(name) {
  const n = (name || "").trim();

  if (!n) {
    throw new HttpError(400, "name is required", "VALIDATION_ERROR");
  }

  if (n.length < 3) {
    throw new HttpError(
      400,
      "name must be at least 3 chars",
      "VALIDATION_ERROR"
    );
  }

  return n;
}

async function createProject({ name }, currentUser) {
  const projects = await readProjects();
  const now = new Date().toISOString();
  const userSnapshot = getUserSnapshot(currentUser);

  const project = {
    id: crypto.randomUUID(),
    name: validateName(name),
    createdAt: now,
    updatedAt: now,
    createdBy: userSnapshot,
    updatedBy: userSnapshot,
  };

  projects.push(project);

  await writeProjects(projects);

  await logActivity({
    entityType: "project",
    entityId: project.id,
    action: "project_created",
    message: `Project "${project.name}" created`,
  });

  return project;
}

async function listProjects() {
  return readProjects();
}

async function getProjectById(id) {
  const projects = await readProjects();
  const project = projects.find((p) => p.id === id);

  assertFound(project, "Project not found");

  return project;
}

async function getProjectSummaryById(id) {
  const project = await getProjectById(id);
  const issues = await readIssues();

  const projectIssues = issues.filter((issue) => issue.projectId === id);

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
      issue.dueDate &&
      new Date(issue.dueDate) < now &&
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

async function updateProjectById(id, { name }, currentUser) {
  const projects = await readProjects();

  const index = projects.findIndex((p) => p.id === id);
  const existingProject = projects[index];

  assertFound(existingProject, "Project not found");

  const updatedProject = {
    ...existingProject,
    name: validateName(name),
    updatedAt: new Date().toISOString(),
    updatedBy: getUserSnapshot(currentUser),
  };

  projects[index] = updatedProject;

  await writeProjects(projects);

  await logActivity({
    entityType: "project",
    entityId: updatedProject.id,
    action: "project_updated",
    message: `Project renamed to "${updatedProject.name}"`,
  });

  return updatedProject;
}

async function deleteProjectById(id) {
  const projects = await readProjects();
  const issues = await readIssues();

  const project = projects.find((p) => p.id === id);

  assertFound(project, "Project not found");

  const updatedProjects = projects.filter((p) => p.id !== id);
  const updatedIssues = issues.filter((issue) => issue.projectId !== id);

  const deletedIssuesCount = issues.length - updatedIssues.length;

  await Promise.all([writeProjects(updatedProjects), writeIssues(updatedIssues)]);

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