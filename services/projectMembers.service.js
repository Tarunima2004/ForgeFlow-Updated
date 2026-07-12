const pool = require("../utils/db");
const { HttpError } = require("../utils/errors");

// ==============================
// Add Member To Project
// ==============================

async function addMember(projectId, userId) {

  const existing =
    await pool.query(
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

  if (
    existing.rows.length > 0
  ) {
    throw new HttpError(
      409,
      "User is already a member of this project",
      "MEMBER_ALREADY_EXISTS"
    );
  }

  const result =
    await pool.query(
      `
      INSERT INTO project_members
      (
        project_id,
        user_id
      )
      VALUES
      (
        $1,
        $2
      )
      RETURNING *
      `,
      [
        projectId,
        userId,
      ]
    );

  return result.rows[0];
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