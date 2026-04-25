const fs = require("fs");
const path = require("path");

function restoreBackup(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Backup file not found");
  }

  const data = fs.readFileSync(filePath, "utf-8");

  const parsed = JSON.parse(data);

  // You will replace your data source here
  // Example:
  fs.writeFileSync(
    path.join(__dirname, "../data/db.json"),
    JSON.stringify(parsed, null, 2)
  );

  return {
    message: "Restore completed successfully",
  };
}

module.exports = {
  restoreBackup,
};