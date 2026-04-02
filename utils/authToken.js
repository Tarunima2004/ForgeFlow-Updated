const crypto = require("crypto");
const { HttpError } = require("./errors");

const AUTH_SECRET =
  process.env.AUTH_SECRET || "forgeflow-dev-secret-change-this";

const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 1 day

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(data) {
  return crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(data)
    .digest("base64url");
}

function createAuthToken(payload) {
  const tokenPayload = {
    id: payload.id,
    role: payload.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(tokenPayload));
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function verifyAuthToken(token) {
  if (!token || typeof token !== "string") {
    throw new HttpError(401, "Token is required", "TOKEN_REQUIRED");
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    throw new HttpError(401, "Invalid token format", "INVALID_TOKEN");
  }

  const [encodedPayload, receivedSignature] = parts;
  const expectedSignature = sign(encodedPayload);

  const a = Buffer.from(receivedSignature);
  const b = Buffer.from(expectedSignature);

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new HttpError(401, "Invalid token signature", "INVALID_TOKEN");
  }

  let payload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload));
  } catch {
    throw new HttpError(401, "Invalid token payload", "INVALID_TOKEN");
  }

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new HttpError(401, "Token expired", "TOKEN_EXPIRED");
  }

  return payload;
}

module.exports = {
  createAuthToken,
  verifyAuthToken,
};