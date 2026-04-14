const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/requests.log");

function logRequest({ method, path: reqPath, statusCode, ms }) {
  const logEntry = {
    time: new Date().toISOString(),
    method,
    path: reqPath,
    statusCode,
    duration: ms,
  };

  const logLine = JSON.stringify(logEntry) + "\n";

  // Write to file
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error("Failed to write log:", err);
    }
  });

  // Optional: still log to console
  console.log(
    `[${logEntry.time}] ${method} ${reqPath} -> ${statusCode} (${ms}ms)`
  );
}

module.exports = logRequest;