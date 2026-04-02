const crypto = require("crypto");
const { HttpError } = require("../utils/errors");
const usersService = require("../services/users.service");
const { createAuthToken } = require("../utils/authToken");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(storedPassword, enteredPassword) {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    throw new HttpError(
      500,
      "Stored password format is invalid",
      "INVALID_STORED_PASSWORD"
    );
  }

  const hash = crypto
    .scryptSync(enteredPassword, salt, 64)
    .toString("hex");

  return hash === storedHash;
}

function toSafeUser(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

async function register({ name, email, password, role }) {
  const hashedPassword = hashPassword(password);

  const user = await usersService.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const safeUser = toSafeUser(user);

  // ✅ FIXED HERE
  const token = createAuthToken({
    id: user.id,
    role: user.role,
  });

  return {
    user: safeUser,
    token,
  };
}

async function login({ email, password }) {
  const user = await usersService.getUserByEmail(email);

  if (!user) {
    throw new HttpError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  const isValid = verifyPassword(user.password, password);

  if (!isValid) {
    throw new HttpError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  const safeUser = toSafeUser(user);

  // ✅ FIXED HERE
  const token = createAuthToken({
    id: user.id,
    role: user.role,
  });

  return {
    user: safeUser,
    token,
  };
}

module.exports = {
  register,
  login,
};