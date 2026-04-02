const readJson = require("./readJson");
const { HttpError } = require("./errors");

function ensureJsonRequest(req) {
  const ct = req.headers["content-type"] || "";

  if (!ct.includes("application/json")) {
    throw new HttpError(
      415,
      "Content-Type must be application/json",
      "UNSUPPORTED_MEDIA_TYPE"
    );
  }
}

async function readJsonBody(req) {
  ensureJsonRequest(req);
  return readJson(req);
}

module.exports = {
  ensureJsonRequest,
  readJsonBody,
};