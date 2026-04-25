const fs = require("fs");
const path = require("path");

function restoreBackup(folderPath) {
  if (!fs.existsSync(folderPath)) {
    throw new Error("Backup folder not found");
  }

  const files = fs.readdirSync(folderPath);

  // Loop through each JSON file
  files.forEach((file) => {
    const fullPath = path.join(folderPath, file);

    // Read each file
    const data = fs.readFileSync(fullPath, "utf-8");

    // Write back to main data folder
    const targetPath = path.join(__dirname, "../data", file);

    fs.writeFileSync(targetPath, data);
  });

  return {
    message: "Restore completed successfully",
  };
}

module.exports = {
  restoreBackup,
};