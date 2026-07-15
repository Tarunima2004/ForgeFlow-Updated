const crypto = require("crypto");
const pool = require("../utils/db");
const { HttpError, assertFound, ERROR_CODES } = require("../utils/errors");
const jobRoles =require("../config/jobRoles");
const {
  logActivity,
} = require("./activity.service");

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizeRole(role) {
  return role.trim().toLowerCase();
}

/**
 * Sanitizes user object by removing sensitive information
 * @param {Object} user - The user object to sanitize
 * @returns {Object} - A new user object without the password property
 */
function validateRole(role) {

  const normalizedRole =
    normalizeRole(role);

  const allowedRoles = [
    "admin",
    "manager",
    "member",
  ];

  if (
    !allowedRoles.includes(
      normalizedRole
    )
  ) {

    throw new HttpError(
      400,
      "Invalid role",
      ERROR_CODES.VALIDATION_ERROR
    );

  }

  return normalizedRole;
}
function sanitizeUser(user) {
  const { password, ...safeUser } = user; // Destructure user to remove password
  return safeUser; // Return the sanitized user object
}
async function getJobRoles() {
  return jobRoles;
}
// ✅ LIST USERS
// ✅ LIST USERS
async function listUsers() {

  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.dept,
      u.job_role,
      u.phone_number,

      COUNT(
        DISTINCT pm.project_id
      ) AS project_count,

      COUNT(
        DISTINCT i.id
      ) AS issue_count,

      'Offline' AS status,

      NULL AS last_active

    FROM users u

    LEFT JOIN project_members pm
      ON pm.user_id = u.id

    LEFT JOIN issues i
      ON i.assigned_to = u.id

    GROUP BY
      u.id,
      u.name,
      u.email,
      u.role,
      u.dept,
      u.job_role,
      u.phone_number

    ORDER BY u.name;
    `
  );

  return result.rows;
}
// ✅ GET USER BY ID
async function getUserById(id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  const user = result.rows[0];
  assertFound(user, "User not found");

  return sanitizeUser(user);
}

// ✅ RAW LOOKUP (used internally)
async function findUserById(id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0] || null;
}

// ✅ GET USER BY EMAIL
async function getUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [normalizedEmail]
  );

  return result.rows[0] || null;
}
function normalizeDept(dept) {
  return dept.trim();
}

function normalizeJobRole(jobRole) {
  return jobRole?.trim() || null;
}
// ✅ CREATE USER (MAIN FIX)
async function createUser({ name, email, password, role = "member",dept,  jobRole,phoneNumber}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = normalizeRole(role);
  const normalizedDept = normalizeDept(dept);
  const normalizedJobRole =normalizeJobRole(jobRole);

  // Check existing user
  const existing = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [normalizedEmail]
  );

  if (existing.rows.length > 0) {
    throw new HttpError(
      409,
      "Email already exists",
      ERROR_CODES.CONFLICT
    );
  }

  const now = new Date().toISOString();

  const result = await pool.query(
    `INSERT INTO users (id, name, email, password, role, dept, job_role,phone_number,created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10)
     RETURNING *`,
    [
      crypto.randomUUID(),
      name.trim(),
      normalizedEmail,
      password.trim(),
      normalizedRole,
      normalizedDept,
      normalizedJobRole,
      phoneNumber?.trim() || null,
      now,
      now,
    ]
  );

  return sanitizeUser(result.rows[0]);
}
async function updateUserRole(
  userId,
  role,
  currentUser
) {

  const normalizedRole =
    validateRole(role);

  const existingUser =
    await findUserById(
      userId
    );

  assertFound(
    existingUser,
    "User not found"
  );

  if (
    existingUser.id ===
    currentUser.id
  ) {

    throw new HttpError(
      400,
      "You cannot change your own role",
      ERROR_CODES.VALIDATION_ERROR
    );

  }
  if (existingUser.role === normalizedRole) {

  throw new HttpError(
    409,
    `User is already a ${normalizedRole}`,
    ERROR_CODES.CONFLICT
  );

}
  const result =
    await pool.query(
      `
      UPDATE users
      SET
        role = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [
        normalizedRole,
        userId,
      ]
    );

  const updatedUser =
    result.rows[0];

  await logActivity({

    entityType: "user",

    entityId:
      updatedUser.id,

    action:
      "user_role_updated",

    message:
      `${currentUser.name} changed ${updatedUser.name}'s role to ${normalizedRole}`,
    userId: currentUser.id,
  });

  return sanitizeUser(
    updatedUser
  );

}

module.exports = {
  listUsers,
  getUserById,
  findUserById,
  getUserByEmail,
  createUser,
   getJobRoles,
   updateUserRole,
};