const pool = require("../utils/db");
const { HttpError } = require("../utils/errors");
const {sendProjectAssignmentEmail,} = require("./email.service");

// ==============================
// Add Member To Project
// ==============================

async function addMember(
  projectId,
  userId,
  permissionRole,
  currentUser
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ==============================
    // Get project
    // ==============================

    const projectResult =
      await client.query(
        `
        SELECT
          id,
          project_name,
          dept,
          is_archived
        FROM projects
        WHERE id = $1
        `,
        [projectId]
      );

    if (projectResult.rows.length === 0) {
      throw new HttpError(
        404,
        "Project not found",
        "PROJECT_NOT_FOUND"
      );
    }

    const project =
      projectResult.rows[0];

    if (project.is_archived) {
      throw new HttpError(
        400,
        "Cannot add members to an archived project",
        "PROJECT_ARCHIVED"
      );
    }

    // ==============================
    // Validate role
    // ==============================

    if (
      permissionRole !== "member" &&
      permissionRole !== "manager"
    ) {
      throw new HttpError(
        400,
        "Invalid project role",
        "INVALID_PROJECT_ROLE"
      );
    }

    // ==============================
    // Authorization
    // ==============================

    if (currentUser.role !== "admin") {
      const managerResult =
        await client.query(
          `
          SELECT id
          FROM project_members
          WHERE project_id = $1
            AND user_id = $2
            AND permission_role = 'manager'
          `,
          [
            projectId,
            currentUser.id,
          ]
        );

      if (
        managerResult.rows.length === 0
      ) {
        throw new HttpError(
          403,
          "You are not a manager of this project",
          "PROJECT_MANAGER_REQUIRED"
        );
      }

      if (
        permissionRole !== "member"
      ) {
        throw new HttpError(
          403,
          "Project managers can only add members",
          "MANAGER_CANNOT_ASSIGN_MANAGER"
        );
      }
    }

    // ==============================
    // Get user
    // ==============================

    const userResult =
      await client.query(
        `
        SELECT
          id,
          name,
          email,
          role,
          dept,
          job_role
        FROM users
        WHERE id = $1
        `,
        [userId]
      );

    if (userResult.rows.length === 0) {
      throw new HttpError(
        404,
        "User not found",
        "USER_NOT_FOUND"
      );
    }

    const user =
      userResult.rows[0];

    // ==============================
    // Only members can be added
    // ==============================

    if (user.role !== "member") {
      throw new HttpError(
        400,
        "Only members can be added",
        "INVALID_PROJECT_MEMBER"
      );
    }

    // ==============================
    // Department validation
    // ==============================

    if (
      user.dept !== project.dept
    ) {
      throw new HttpError(
        400,
        "Department mismatch",
        "DEPARTMENT_MISMATCH"
      );
    }

    // ==============================
    // Duplicate check
    // ==============================

    const existing =
      await client.query(
        `
        SELECT id
        FROM project_members
        WHERE project_id = $1
          AND user_id = $2
        `,
        [
          projectId,
          userId,
        ]
      );

    if (existing.rows.length > 0) {
      throw new HttpError(
        409,
        "User is already a member of this project",
        "MEMBER_ALREADY_EXISTS"
      );
    }

    // ==============================
    // Insert member
    // ==============================

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
          user.job_role,
          currentUser.id,
        ]
      );

    const membership =
      result.rows[0];

    await client.query("COMMIT");

    // ==============================
    // Send email
    // ==============================

    try {
      await sendProjectAssignmentEmail({
        email: user.email,
        name: user.name,
        projectName:
          project.project_name,
        permissionRole,
        designation:
          user.job_role,
      });
    } catch (emailError) {
      console.error(
        "Email failed:",
        emailError.message
      );
    }

    return membership;
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    throw error;
  } finally {
    client.release();
  }
}
// ==============================
// List Members Of A Project
// ==============================

async function listMembers(projectId) {

  const result = await pool.query(
    `
    SELECT
      u.id AS user_id,
      u.name,
      u.email,
      u.role,
      u.dept,
      u.job_role,
      u.phone_number,

      pm.permission_role,
      pm.project_designation,
      pm.joined_at

    FROM project_members pm

    JOIN users u
      ON pm.user_id = u.id

    WHERE pm.project_id = $1

    ORDER BY
      CASE
        WHEN pm.permission_role = 'manager' THEN 1
        ELSE 2
      END,
      u.name
    `,
    [projectId]
  );

  return result.rows;
}// ==============================
// Remove Member
// ==============================

async function removeMember(
  projectId,
  userId
) {

  const result =
    await pool.query(
      `
      DELETE FROM project_members
      WHERE project_id = $1
      AND user_id = $2
      RETURNING *
      `,
      [
        projectId,
        userId,
      ]
    );

  if (
    result.rows.length === 0
  ) {
    throw new HttpError(
      404,
      "Member not found",
      "MEMBER_NOT_FOUND"
    );
  }

  return result.rows[0];
}

// ==============================
// Projects For One User
// ==============================

async function listProjectsForUser(
  userId
) {

  const result =
    await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.status,
        pm.joined_at
      FROM project_members pm
      JOIN projects p
      ON pm.project_id = p.id
      WHERE pm.user_id = $1
      ORDER BY p.name
      `,
      [
        userId,
      ]
    );

  return result.rows;
}

module.exports = {
  addMember,
  listMembers,
  removeMember,
  listProjectsForUser,
};