const fs = require("fs").promises;
const path = require("path");
const sendJson = require("../utils/sendJson");

// In-memory cache
let docsCache = null;
let lastLoadedTime = null;

// Optional: cache expiry (in ms)
const CACHE_TTL = 60 * 1000; // 1 minute

async function loadDocs() {
  const now = Date.now();

  // If cache exists and not expired → return cached
  if (docsCache && lastLoadedTime && (now - lastLoadedTime < CACHE_TTL)) {
    return docsCache;
  }

  // Otherwise reload from file
  const filePath = path.join(__dirname, "../docs/apiDocs.json");

  const data = await fs.readFile(filePath, "utf-8");

  const parsed = JSON.parse(data);

  // Update cache
  docsCache = parsed;
  lastLoadedTime = now;

  return parsed;
}

async function handleDocsRoutes(req, res, pathName) {
  // Support versioning
  if (req.method === "GET" && (pathName === "/docs" || pathName === "/docs/v1")) {
    try {
      const docs = await loadDocs();

      return sendJson(res, 200, {
        success: true,
        version: "v1",
        data: docs,
      });

    } catch (err) {
      return sendJson(res, 500, {
        success: false,
        error: {
          message: "Failed to load API docs",
          details: err.message,
        },
      });
    }
  }

  return false;
}

module.exports = {
  handleDocsRoutes,
};