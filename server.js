const http = require("http");

const sendJson = require("./utils/sendJson");
const readJson = require("./utils/readJson");
const { HttpError } = require("./utils/errors");
const logRequest = require("./utils/logger");

const { handleIssuesRoutes } = require("./routes/issues.routes");
const { handleProjectsRoutes } = require("./routes/projects.routes");
const { handleUsersRoutes } = require("./routes/users.routes");
const { handleAuthRoutes } = require("./routes/auth.routes");

const PORT = process.env.PORT || 3000;

function sendError(res, err) {
  if (res.headersSent) {
    console.error("sendError skipped because headers already sent:", err.message);
    return;
  }

  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message =
    err instanceof HttpError ? err.message : "Internal Server Error";
  const code = err instanceof HttpError ? err.code : "INTERNAL_ERROR";

  return sendJson(res, statusCode, {
    success: false,
    error: { message, code },
  });
}

function isJsonRequest(req) {
  const ct = req.headers["content-type"] || "";
  return ct.includes("application/json");
}

const server = http.createServer(async (req, res) => {
  const start = Date.now();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  console.log("DEBUG SERVER HIT =>", req.method, path);
  console.log("SERVER FILE UPDATED WORKING");

  res.on("finish", () => {
    logRequest({
      method: req.method,
      path,
      statusCode: res.statusCode,
      ms: Date.now() - start,
    });
  });

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  try {
    if (req.method === "GET" && path === "/health") {
      return sendJson(res, 200, {
        success: true,
        data: { ok: true },
      });
    }

    if (req.method === "POST" && path === "/echo") {
      if (!isJsonRequest(req)) {
        throw new HttpError(
          415,
          "Content-Type must be application/json",
          "UNSUPPORTED_MEDIA_TYPE"
        );
      }

      const body = await readJson(req);

      return sendJson(res, 200, {
        success: true,
        data: body,
      });
    }

    // Route handlers must return:
    // true  => route matched and response handled
    // false => route not matched

    if (await handleAuthRoutes(req, res, path)) return;
    if (await handleUsersRoutes(req, res, path)) return;
    if (await handleProjectsRoutes(req, res, path)) return;
    if (await handleIssuesRoutes(req, res, path, url)) return;

    return sendJson(res, 404, {
      success: false,
      error: {
        message: "Route not found",
        code: "NOT_FOUND",
      },
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);

    if (res.headersSent) {
      return;
    }

    return sendError(res, err);
  }
});

server.listen(PORT, () => {
  console.log(`ForgeFlow server running on http://localhost:${PORT}`);
});