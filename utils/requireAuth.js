const { HttpError } = require("./errors");
const { verifyAuthToken } = require("./authToken");
const usersService = require("../services/users.service");

function toSafeUser(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

async function requireAuth(req) {
  const authHeader = req.headers.authorization || "";

  // ✅ Case 1: No header
  if (!authHeader) {
    throw new HttpError(401, "Authorization token missing", "AUTH_REQUIRED");
  }

  // ✅ Case 2: Wrong format
  if (!authHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Invalid token format", "INVALID_TOKEN");
  }

  const token = authHeader.slice(7).trim();

  // ✅ Case 3: Empty token
  if (!token) {
    throw new HttpError(401, "Authorization token missing", "AUTH_REQUIRED");
  }

  // ✅ CRITICAL FIX: wrap token verification
  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch (err) {
    throw new HttpError(401, "Invalid token", "INVALID_TOKEN");
  }

  const user = await usersService.findUserById(payload.id);

  if (!user) {
    throw new HttpError(401, "User no longer exists", "INVALID_TOKEN");
  }

  const safeUser = toSafeUser(user);

  req.user = safeUser;
  return safeUser;
}

module.exports = {
  requireAuth,
};