const crypto = require("crypto");
const { HttpError } = require("./errors");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${hash}`;
}

function verifyPassword(
  storedPassword,
  enteredPassword
) {

  const [salt, storedHash] =
    storedPassword.split(":");

  if (!salt || !storedHash) {

    throw new HttpError(
      500,
      "Stored password format is invalid",
      "INVALID_STORED_PASSWORD"
    );

  }

  const hash = crypto
    .scryptSync(
      enteredPassword,
      salt,
      64
    )
    .toString("hex");

  return hash === storedHash;

}

module.exports = {
  hashPassword,
  verifyPassword,
};