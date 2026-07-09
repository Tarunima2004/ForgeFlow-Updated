const crypto = require("crypto");
const pool = require("../utils/db");
const { HttpError, assertFound } = require("../utils/errors");
const { getUserSnapshot } = require("../utils/authUserSnapshot");
const { logActivity } = require("./activity.service");
const {sendProjectAssignmentEmail,} = require("./email.service");

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
function validateProjectCode(projectCode) {
  const code = (projectCode || "").trim().toUpperCase();

  if (!code) {
    throw new HttpError(
      400,
      "project_code is required",
      "VALIDATION_ERROR"
    );
  }

  if (!/^[A-Z0-9_-]{2,10}$/.test(code)) {
    throw new HttpError(
      400,
      "Invalid project code",
      "VALIDATION_ERROR"
    );
  }

  return code;
}

function validateStatus(status = "planning") {
  const allowed = [
    "planning",
    "active",
    "on_hold",
    "completed",
    "cancelled",
    "archived",
  ];

  if (!allowed.includes(status)) {
    throw new HttpError(
      400,
      "Invalid status",
      "VALIDATION_ERROR"
    );
  }

  return status;
}

function validatePriority(priority = "medium") {
  const allowed = [
    "low",
    "medium",
    "high",
    "critical",
  ];

  if (!allowed.includes(priority)) {
    throw new HttpError(
      400,
      "Invalid priority",
      "VALIDATION_ERROR"
    );
  }

  return priority;
}

function validateVisibility(visibility = "private") {
  const allowed = [
    "private",
    "organization",
    "public",
  ];

  if (!allowed.includes(visibility)) {
    throw new HttpError(
      400,
      "Invalid visibility",
      "VALIDATION_ERROR"
    );
  }

  return visibility;
}
async function generateProjectId() {

  const result =
    await pool.query(`
      SELECT nextval('project_id_seq') AS number
    `);

  const number =
    Number(
      result.rows[0].number
    );

  return `PRJ-${String(number).padStart(6, "0")}`;
}
async function insertProject(client, projectData) {
  const result = await client.query(
    `
    INSERT INTO projects
    (
      id,
      project_id,
      project_code,
      project_name,
      description,

      status,
      priority,

      start_date,
      end_date,

      estimated_completion,
      actual_completion,

      visibility,

      allow_time_tracking,
      allow_comments,
      allow_file_uploads,

      completion_percentage,

      created_by,
      created_at,

      updated_by,
      updated_at,

      is_archived
    )

    VALUES
    (
      $1,$2,$3,$4,$5,
      $6,
      $7,$8,
      $9,$10,
      $11,$12,
      $13,
      $14,$15,$16,
      $17,
      $18,$19,
      $20,$21
    )

    RETURNING *
    `,
    projectData
  );

  return result.rows[0];
}
async function addProjectMember(
  client,
  projectId,
  userId,
  permissionRole,
  projectDesignation,
  addedBy
) {

  const result =
    await client.query(
      `
      INSERT INTO project_members
      (
        project_id,
        user_id,
        permission_role,
        project_designation,
        added_by
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *
      `,
      [
        projectId,
        userId,
        permissionRole,
        projectDesignation,
        addedBy
      ]
    );

  return result.rows[0];

}// ✅ CREATE PROJECT
async function createProject(data, currentUser) {

  const client = await pool.connect();
  try {
  await client.query("BEGIN");
  const now = new Date().toISOString();

  const userId = currentUser.id;
  const projectId =
    await generateProjectId();

  const projectName =
    validateName(
      data.project_name
    );

  const projectCode =
    validateProjectCode(
      data.project_code
    );
  const projectTeam = Array.isArray(data.project_team)
  ? data.project_team
  : [];
for (const member of projectTeam) {

  const userResult = await client.query(
    `
    SELECT id
    FROM users
    WHERE id = $1
    `,
    [member.user_id]
  );
  

  if (userResult.rows.length === 0) {

    throw new HttpError(
      404,
      `User ${member.user_id} not found`,
      "PROJECT_MEMBER_NOT_FOUND"
    );

  }

}  const existingProject =
    await client.query(
      `
      SELECT id
      FROM projects
      WHERE project_code = $1
      `,
      [projectCode]
    );

if (
    existingProject.rows.length
) {

    throw new HttpError(
        409,
        "Project code already exists",
        "PROJECT_CODE_EXISTS"
    );

}
const project = await insertProject(client, [
  crypto.randomUUID(),

  projectId,

  projectCode,

  projectName,

  data.description || null,


  validateStatus(data.status),

  validatePriority(data.priority),

  data.start_date || null,

  data.end_date || null,

  data.estimated_completion || null,

  data.actual_completion || null,

  validateVisibility(data.visibility),

  data.allow_time_tracking ?? true,

  data.allow_comments ?? true,

  data.allow_file_uploads ?? true,

  0,

  userId,

  now,

  userId,

  now,

  false,
]);
for (const member of projectTeam) {

  await addProjectMember(
    client,
    project.id,
    member.user_id,
    member.permission_role,
    member.project_designation || null,
    currentUser.id
  );

}
  await logActivity({

    entityType: "project",

    entityId: project.id,

    action: "project_created",

    message:
      `Project "${project.project_name}" created`,
  });
  await client.query("COMMIT");
  for (const member of projectTeam) {
    const userResult = await pool.query(
`
SELECT
name,
email
FROM users
WHERE id = $1
`,
[member.user_id]
);
const user =
  userResult.rows[0];

await sendProjectAssignmentEmail({

    email: user.email,

    name: user.name,

    projectName: project.project_name,

    permissionRole: member.permission_role,

    designation: member.project_designation,

});
}
  return project;
  }
  catch (error) {

    await client.query("ROLLBACK");

    throw error;

}
   finally {
  client.release();
}
}
// ✅ LIST PROJECTS
async function listProjects() {
  const projectsResult =
  await pool.query(`
    SELECT *
    FROM projects
    WHERE is_archived = false
    ORDER BY created_at DESC
  `);
  const projects =
    projectsResult.rows;

  for (const project of projects) {

    const issuesResult =
      await pool.query(
        `
        SELECT *
        FROM issues
        WHERE project_id = $1
        `,
        [project.id]
      );

    const issues =
      issuesResult.rows;

    const issueCount =
      issues.length;

    const completedIssues =
      issues.filter(
        issue =>
          issue.status === "done"
      ).length;
     const openIssues =
  issues.filter(
    issue =>
      issue.status !== "done"
  );

let priority = "low";

if (
  openIssues.some(
    issue =>
      issue.priority === "critical"
  )
) {

  priority = "critical";

} else if (
  openIssues.some(
    issue =>
      issue.priority === "high"
  )
) {

  priority = "high";

} else if (
  openIssues.some(
    issue =>
      issue.priority === "medium"
  )
) {

  priority = "medium";
}
    const progress =
      issueCount === 0
        ? 0
        : Math.round(
            (
              completedIssues /
              issueCount
            ) * 100
          );

    project.issueCount =
      issueCount;

    project.completedIssues =
      completedIssues;

    project.progress =
      progress;
      project.priority =
  priority;
  }

  return projects;
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
    projectName: project.project_name,
    totalIssues: projectIssues.length,
    statusBreakdown,
    priorityBreakdown,
    overdueIssues,
  };
}

// ✅ UPDATE PROJECT
async function updateProjectById(id, updates, currentUser) {

  const fields = [];
  const values = [];
  let index = 1;

  // Project Name
  if (updates.project_name !== undefined) {
    fields.push(`project_name = $${index++}`);
    values.push(validateName(updates.project_name));
  }

  // Project Code
  if (updates.project_code !== undefined) {

    const projectCode =
      validateProjectCode(updates.project_code);
    
    const existingProject =
      await pool.query(
        `
        SELECT id
        FROM projects
        WHERE project_code = $1
        AND id != $2
        `,
        [projectCode, id]
      );

    if (existingProject.rows.length > 0) {
      throw new HttpError(
        409,
        "Project code already exists",
        "PROJECT_CODE_EXISTS"
      );
    }

    fields.push(`project_code = $${index++}`);
    values.push(projectCode);
  }

  // Description
  if (updates.description !== undefined) {
    fields.push(`description = $${index++}`);
    values.push(updates.description);
  }

  // Project Manager
  if (updates.project_manager !== undefined) {

    if (updates.project_manager !== null) {

      const manager =
        await pool.query(
          `
          SELECT id
          FROM users
          WHERE id = $1
          `,
          [updates.project_manager]
        );

      if (manager.rows.length === 0) {
        throw new HttpError(
          404,
          "Project manager not found",
          "PROJECT_MANAGER_NOT_FOUND"
        );
      }
    }

    fields.push(`project_manager = $${index++}`);
    values.push(updates.project_manager);
  }

  // Status
  if (updates.status !== undefined) {
    fields.push(`status = $${index++}`);
    values.push(validateStatus(updates.status));
  }

  // Priority
  if (updates.priority !== undefined) {
    fields.push(`priority = $${index++}`);
    values.push(validatePriority(updates.priority));
  }

  // Dates
  if (updates.start_date !== undefined) {
    fields.push(`start_date = $${index++}`);
    values.push(updates.start_date);
  }

  if (updates.end_date !== undefined) {
    fields.push(`end_date = $${index++}`);
    values.push(updates.end_date);
  }

  if (updates.estimated_completion !== undefined) {
    fields.push(`estimated_completion = $${index++}`);
    values.push(updates.estimated_completion);
  }

  if (updates.actual_completion !== undefined) {
    fields.push(`actual_completion = $${index++}`);
    values.push(updates.actual_completion);
  }

  // Visibility
  if (updates.visibility !== undefined) {
    fields.push(`visibility = $${index++}`);
    values.push(validateVisibility(updates.visibility));
  }

  // Feature Toggles
  if (updates.allow_time_tracking !== undefined) {
    fields.push(`allow_time_tracking = $${index++}`);
    values.push(updates.allow_time_tracking);
  }

  if (updates.allow_comments !== undefined) {
    fields.push(`allow_comments = $${index++}`);
    values.push(updates.allow_comments);
  }

  if (updates.allow_file_uploads !== undefined) {
    fields.push(`allow_file_uploads = $${index++}`);
    values.push(updates.allow_file_uploads);
  }

  // Always update audit fields
  fields.push(`updated_by = $${index++}`);
  values.push(currentUser.id);

  fields.push(`updated_at = $${index++}`);
  values.push(new Date().toISOString());

  values.push(id);

  const result =
    await pool.query(
      `
      UPDATE projects
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
      `,
      values
    );

  const updatedProject =
    result.rows[0];

  assertFound(
    updatedProject,
    "Project not found"
  );

  await logActivity({
    entityType: "project",
    entityId: updatedProject.id,
    action: "project_updated",
    message: `Project "${updatedProject.project_name}" updated`,
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
    message: `Project "${project.project_name}" deleted`,
  });

  return {
    deletedProject: project,
    deletedIssuesCount,
  };
}
async function getProjectStats() {

  const totalProjectsResult =
    await pool.query(`
      SELECT COUNT(*) AS count
      FROM projects
    `);

  const activeProjectsResult =
    await pool.query(`
      SELECT COUNT(*) AS count
      FROM projects
      WHERE status = 'active'
      AND is_archived = false
    `);

  const completedProjectsResult =
    await pool.query(`
      SELECT COUNT(*) AS count
      FROM projects
      WHERE status = 'completed'
      AND is_archived = false
    `);

  const archivedProjectsResult =
    await pool.query(`
      SELECT COUNT(*) AS count
      FROM projects
      WHERE is_archived = true
    `);

  return {
    totalProjects:
      Number(
        totalProjectsResult.rows[0].count
      ),

    activeProjects:
      Number(
        activeProjectsResult.rows[0].count
      ),

    completedProjects:
      Number(
        completedProjectsResult.rows[0].count
      ),

    archivedProjects:
      Number(
        archivedProjectsResult.rows[0].count
      ),
  };
}
async function getProjectInsights() {
  // Total Issues
  const totalIssuesResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM issues
  `);

  // Open Issues (anything not done)
  const openItemsResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM issues
    WHERE status != 'done'
  `);

  // Completed Issues
  const completedIssuesResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM issues
    WHERE status = 'done'
  `);

  // Total Users
  const teamSizeResult = await pool.query(`
    SELECT COUNT(*) AS count
    FROM users
  `);

  const totalIssues =
    Number(totalIssuesResult.rows[0].count);

  const openItems =
    Number(openItemsResult.rows[0].count);

  const completedIssues =
    Number(completedIssuesResult.rows[0].count);

  const teamSize =
    Number(teamSizeResult.rows[0].count);

  const completion =
    totalIssues === 0
      ? 0
      : Math.round(
          (completedIssues / totalIssues) * 100
        );

  return {
    totalIssues,
    openItems,
    completion,
    teamSize,
  };
}
async function getProjectHealth() {

  const projectsResult =
    await pool.query(`
      SELECT *
      FROM projects
    `);

  const projects =
    projectsResult.rows;

  let healthy = 0;
  let atRisk = 0;
  let delayed = 0;

  for (const project of projects) {

    const issuesResult =
      await pool.query(
        `
        SELECT *
        FROM issues
        WHERE project_id = $1
        `,
        [project.id]
      );

    const issues =
      issuesResult.rows;

    const issueCount =
      issues.length;

    const completedIssues =
      issues.filter(
        issue =>
          issue.status === "done"
      ).length;

    const openIssues =
      issueCount -
      completedIssues;

    const criticalIssues =
      issues.filter(
        issue =>
          issue.priority ===
            "critical" &&
          issue.status !==
            "done"
      ).length;

    let overdueIssues = 0;

    const now =
      new Date();

    for (const issue of issues) {

      if (
        issue.due_date &&
        new Date(
          issue.due_date
        ) < now &&
        issue.status !==
          "done"
      ) {
        overdueIssues++;
      }
    }

    const progress =
      issueCount === 0
        ? 0
        : Math.round(
            (
              completedIssues /
              issueCount
            ) * 100
          );

    let score = 100;

    // Progress Penalty
    if (
      progress >= 50 &&
      progress < 80
    ) {
      score -= 15;
    } else if (
      progress < 50
    ) {
      score -= 30;
    }

    // Open Issues Penalty
    if (
      openIssues >= 6 &&
      openIssues <= 15
    ) {
      score -= 10;
    } else if (
      openIssues > 15
    ) {
      score -= 20;
    }

    // Critical Issues Penalty
    if (
      criticalIssues >= 1 &&
      criticalIssues <= 3
    ) {
      score -= 15;
    } else if (
      criticalIssues > 3
    ) {
      score -= 25;
    }

    // Overdue Issues Penalty
    if (
      overdueIssues >= 1 &&
      overdueIssues <= 3
    ) {
      score -= 20;
    } else if (
      overdueIssues > 3
    ) {
      score -= 30;
    }

    if (
      score >= 80
    ) {
      healthy++;
    } else if (
      score >= 50
    ) {
      atRisk++;
    } else {
      delayed++;
    }
  }

  return {
    healthy,
    atRisk,
    delayed,
  };
}
async function getUpcomingDeadlines() {

  const result =
    await pool.query(`
      SELECT
        id,
        title,
        priority,
        due_date,
        status
      FROM issues
      WHERE due_date IS NOT NULL
      AND status != 'done'
      ORDER BY due_date ASC
      LIMIT 5
    `);

  return result.rows;
}
async function getProjectTimeline() {

  const result =
    await pool.query(`
      SELECT
        id,
        action,
        message,
        created_at
      FROM activity
      WHERE entity_type = 'project'
      ORDER BY created_at DESC
      LIMIT 10
    `);

  return result.rows;
}
async function archiveProjectById(
  id,
  currentUser
) {

  const result =
    await pool.query(
      `
      UPDATE projects
      SET
        is_archived = true,
        updated_by = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [
        currentUser.id,
        id,
      ]
    );

  const project =
    result.rows[0];

  assertFound(
    project,
    "Project not found"
  );

  await logActivity({

    entityType: "project",

    entityId: project.id,

    action: "project_archived",

    message:
      `Project "${project.project_name}" archived`,

  });

  return project;

}
module.exports = {
  createProject,
  listProjects,
  getProjectById,
  getProjectSummaryById,
  updateProjectById,
  deleteProjectById,
  getProjectStats,
  getProjectInsights,
  getProjectHealth,
  getUpcomingDeadlines,
  getProjectTimeline,
  archiveProjectById,
};