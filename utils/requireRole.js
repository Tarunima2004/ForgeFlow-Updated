const { HttpError } = require("./errors");

function requireRole(user, allowedRoles) {
  // ✅ FIX 1: user instead of req.user
  if (!user) {
    throw new HttpError(401, "Authentication required", "AUTH_REQUIRED");
  }

  // ✅ FIX 2: allow single role OR array
  if (!Array.isArray(allowedRoles)) {
    allowedRoles = [allowedRoles];
  }

  if (allowedRoles.length === 0) {
    throw new HttpError(
      500,
      "Allowed roles not configured",
      "ROLE_CONFIG_ERROR"
    );
  }

  // ✅ FIX 3: check user.role instead of req.user.role
  if (!allowedRoles.includes(user.role)) {
    throw new HttpError(403, "Forbidden", "FORBIDDEN");
  }
}

module.exports = {
  requireRole,
};