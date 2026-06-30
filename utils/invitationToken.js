const crypto = require("crypto");

function generateInvitationToken() {

  return crypto
    .randomBytes(32)
    .toString("hex");

}

function hashInvitationToken(token) {

  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

}

module.exports = {
  generateInvitationToken,
  hashInvitationToken,
};