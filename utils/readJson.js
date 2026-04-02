const { HttpError } = require("./errors");

module.exports = function readJson(req, { maxBytes = 1_000_000 } = {}) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        req.destroy();
        return reject(new HttpError(413, "Payload too large", "PAYLOAD_TOO_LARGE"));
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) return resolve({});

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new HttpError(400, "Invalid JSON", "INVALID_JSON"));
      }
    });

    req.on("error", () => reject(new HttpError(400, "Request stream error", "REQUEST_STREAM_ERROR")));
  });
};