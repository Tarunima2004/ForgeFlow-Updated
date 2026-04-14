const { createBackup } = require("../utils/backup");
const sendJson = require("../utils/sendJson");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

async function handleBackupRoutes(req, res, path) {
  if (path === "/backup" && req.method === "POST") {
    try {
      const user = await requireAuth(req);
      requireRole(user, "admin");

      const result = createBackup();

      return sendJson(res, 200, {
        success: true,
        data: result,
      });

    } catch (err) {
      console.error("BACKUP ROUTE ERROR:", err);

      return sendJson(res, err.statusCode || 500, {
        success: false,
        error: {
          message: err.message || "Backup failed",
          code: err.code || "BACKUP_ERROR",
        },
      });
    }
  }

  return false;
}

module.exports = {
  handleBackupRoutes,
};