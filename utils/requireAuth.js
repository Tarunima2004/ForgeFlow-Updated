const { HttpError } = require("./errors");
const { verifyAuthToken } = require("./authToken");
const usersService = require("../services/users.service");

function toSafeUser(user) {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

async function requireAuth(req) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new HttpError(
      401,
      "Authorization token missing",
      "AUTH_REQUIRED"
    );
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    throw new HttpError(
      401,
      "Authorization token missing",
      "AUTH_REQUIRED"
    );
  }

  const payload = verifyAuthToken(token);

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