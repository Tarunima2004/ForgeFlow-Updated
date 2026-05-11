const crypto = require("crypto");
const pool = require("../utils/db");
const { HttpError, assertFound, ERROR_CODES } = require("../utils/errors");

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizeRole(role) {
  return role.trim().toLowerCase();
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ✅ LIST USERS
async function listUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows.map(sanitizeUser);
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

// ✅ CREATE USER (MAIN FIX)
async function createUser({ name, email, password, role = "member" }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = normalizeRole(role);

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
    `INSERT INTO users (id, name, email, password, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      crypto.randomUUID(),
      name.trim(),
      normalizedEmail,
      password.trim(),
      normalizedRole,
      now,
      now,
    ]
  );

  return sanitizeUser(result.rows[0]);
}

module.exports = {
  listUsers,
  getUserById,
  findUserById,
  getUserByEmail,
  createUser,
};