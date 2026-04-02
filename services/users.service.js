const crypto = require("crypto");
const { readUsers, writeUsers } = require("../utils/fileDb");
const { HttpError, assertFound } = require("../utils/errors");

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

async function listUsers() {
  const users = await readUsers();
  return users.map(sanitizeUser);
}

async function getUserById(id) {
  const users = await readUsers();
  const user = users.find((u) => u.id === id);

  assertFound(user, "User not found");
  return sanitizeUser(user);
}

// Raw lookup for auth middleware / internal auth checks
async function findUserById(id) {
  const users = await readUsers();
  return users.find((u) => u.id === id) || null;
}

async function getUserByEmail(email) {
  const users = await readUsers();
  const normalizedEmail = normalizeEmail(email);

  return users.find((u) => u.email === normalizedEmail) || null;
}

async function createUser({ name, email, password, role = "member" }) {
  const users = await readUsers();

  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = normalizeRole(role);

  const existing = users.find((u) => u.email === normalizedEmail);

  if (existing) {
    throw new HttpError(409, "Email already exists", "EMAIL_ALREADY_EXISTS");
  }

  const now = new Date().toISOString();

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password: password.trim(), // already hashed in auth.service.js
    role: normalizedRole,
    createdAt: now,
    updatedAt: now,
  };

  users.push(user);
  await writeUsers(users);

  return sanitizeUser(user);
}

module.exports = {
  listUsers,
  getUserById,
  findUserById,
  getUserByEmail,
  createUser,
};