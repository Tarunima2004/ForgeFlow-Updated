const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const backupRoot = path.join(__dirname, "../backups");

function createBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(backupRoot, `backup-${timestamp}`);

    // ✅ Ensure backup root exists
    if (!fs.existsSync(backupRoot)) {
      fs.mkdirSync(backupRoot, { recursive: true });
    }

    // ✅ Create backup folder safely
    fs.mkdirSync(backupDir, { recursive: true });

    // ✅ Ensure data folder exists
    if (!fs.existsSync(dataDir)) {
      throw new Error("Data folder not found");
    }

    const files = fs.readdirSync(dataDir);

    for (const file of files) {
      const srcPath = path.join(dataDir, file);
      const destPath = path.join(backupDir, file);

      fs.copyFileSync(srcPath, destPath);
    }

    return {
      message: "Backup created successfully",
      backupPath: backupDir,
    };

  } catch (err) {
    console.error("BACKUP ERROR:", err);
    throw err; // let server handle it properly
  }
}

module.exports = {
  createBackup,
};