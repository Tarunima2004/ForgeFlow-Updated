const { createBackup } = require("../utils/backup");
const sendJson = require("../utils/sendJson");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

async function handleBackupRoutes(req, res, path) {
  if (path === "/backup" && req.method === "POST") {

    // ✅ Step 1: authenticate
    const user = await requireAuth(req);

    // ✅ Step 2: check role
    requireRole(user, "admin");

    // ✅ Step 3: create backup
    const result = createBackup();

    return sendJson(res, 200, {
      success: true,
      data: result,
    });
  }

  return false;
}

module.exports = {
  handleBackupRoutes,
};