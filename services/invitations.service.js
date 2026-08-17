const pool =require("../utils/db");
const usersService =require("./users.service");
const {HttpError,} = require("../utils/errors");
const {hashPassword,} = require("../utils/password");
const {
    sendInvitationEmail,
} = require("./email.service");
const {generateInvitationToken,hashInvitationToken,} = require("../utils/invitationToken");
async function getPendingInvitationByEmail(
  email
) {

  const result =
    await pool.query(
      `
      SELECT *
      FROM user_invitations
      WHERE email = $1
      AND status = 'pending'
      `,
      [
        email.trim().toLowerCase(),
      ]
    );

  return result.rows[0] || null;

}
// ==============================
// Find Invitation By Token
// ==============================

async function getInvitationByToken(
  token
) {

  const tokenHash =
    hashInvitationToken(
      token
    );

  const result =
    await pool.query(
      `
      SELECT *
      FROM user_invitations
      WHERE token_hash = $1
      `,
      [
        tokenHash,
      ]
    );

  return result.rows[0] || null;

}
async function createInvitation({
  email,
  name,
  password,
  invitedBy,
}) {
  // ==============================
// Check Existing Registered User
// ==============================

const existingUser =
  await usersService.getUserByEmail(
    email
  );

if (existingUser) {

  throw new HttpError(
    409,
    "User already exists",
    "USER_ALREADY_EXISTS"
  );

}
  // ==============================
// Check Existing Pending Invitation
// ==============================

const existingInvitation =
  await getPendingInvitationByEmail(
    email
  );

if (existingInvitation) {

  throw new HttpError(
    409,
    "Invitation already pending",
    "INVITATION_ALREADY_EXISTS"
  );

}
  // ==============================
// Hash Password
// ==============================

const passwordHash =hashPassword(password);
// ==============================
// Generate Invitation Token
// ==============================

const invitationToken =
  generateInvitationToken();

// ==============================
// Hash Invitation Token
// ==============================

const tokenHash =
  hashInvitationToken(
    invitationToken
  );
// ==============================
// Calculate Expiry
// ==============================

const expiresAt =
  new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );
  // ==============================
// Store Invitation
// ==============================

const result =
  await pool.query(
    `
    INSERT INTO user_invitations
    (
      email,
      name,
      global_role,
      password_hash,
      token_hash,
      status,
      invited_by,
      expires_at
    )
    VALUES
    (
      $1,
      $2,
      'member',
      $3,
      $4,
      'pending',
      $5,
      $6
    )
    RETURNING
      id,
      email,
      name,
      global_role,
      status,
      invited_by,
      expires_at,
      created_at
    `,
    [
      email.trim().toLowerCase(),
      name.trim(),
      passwordHash,
      tokenHash,
      invitedBy,
      expiresAt,
    ]
  );
  await sendInvitationEmail({
    email,
    name,
    invitationToken,
});
return {
  invitation:
    result.rows[0],

  invitationToken,
};
}
module.exports = {
  createInvitation,
  getInvitationByToken,
};