const { HttpError } = require("./errors");

function requireRole(req, allowedRoles) {
  if (!req.user) {
    throw new HttpError(401, "Authentication required", "AUTH_REQUIRED");
  }

  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new HttpError(
      500,
      "Allowed roles not configured",
      "ROLE_CONFIG_ERROR"
    );
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new HttpError(403, "Forbidden", "FORBIDDEN");
  }
}

module.exports = {
  requireRole,
};