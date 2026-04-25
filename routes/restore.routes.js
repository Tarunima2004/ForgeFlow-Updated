const { restoreBackup } = require("../utils/restore");
const sendJson = require("../utils/sendJson");
const readJson = require("../utils/readJson");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

async function handleRestoreRoutes(req, res, path) {
  if (path === "/restore" && req.method === "POST") {
    try {
      const user = await requireAuth(req);
      requireRole(user, "admin");

      const body = await readJson(req);

      const { filePath } = body;

      if (!filePath) {
        throw new Error("filePath is required");
      }

      const result = restoreBackup(filePath);

      return sendJson(res, 200, {
        success: true,
        data: result,
      });

    } catch (err) {
      return sendJson(res, err.statusCode || 500, {
        success: false,
        error: {
          message: err.message || "Restore failed",
          code: err.code || "RESTORE_ERROR",
        },
      });
    }
  }

  return false;
}

module.exports = {
  handleRestoreRoutes,
};