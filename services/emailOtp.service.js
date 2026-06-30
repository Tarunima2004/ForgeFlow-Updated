const pool = require("../utils/db");

const {
  generateOtp,
  hashOtp,
  verifyOtp:verifyOtpHash,
} = require("../utils/otp");
const {
  HttpError,
} = require("../utils/errors");

// ==============================
// Find OTP By Email
// ==============================

async function getOtpByEmail(
  email
) {

  const result =
    await pool.query(
      `
      SELECT *
      FROM email_otps
      WHERE email = $1
      AND purpose = 'registration'
      `,
      [
        email
          .trim()
          .toLowerCase(),
      ]
    );

  return result.rows[0] || null;

}
// ==============================
// Verify OTP
// ==============================
// ==============================
// Check Verified Email
// ==============================

async function getVerifiedOtpByEmail(
  email
) {

  const result =
    await pool.query(
      `
      SELECT *
      FROM email_otps
      WHERE email = $1
      AND purpose = 'registration'
      AND verified = TRUE
      `,
      [
        email
          .trim()
          .toLowerCase(),
      ]
    );

  return result.rows[0] || null;

}
// ==============================
// Delete OTP
// ==============================

async function deleteOtpByEmail(
  email
) {

  await pool.query(
    `
    DELETE
    FROM email_otps
    WHERE email = $1
    AND purpose = 'registration'
    `,
    [
      email
        .trim()
        .toLowerCase(),
    ]
  );

}
async function verifyOtp({

  email,

  otp,

}) {

  // ==============================
  // Find OTP Record
  // ==============================

  const otpRecord =
    await getOtpByEmail(
      email
    );

  if (!otpRecord) {

    throw new HttpError(
      404,
      "OTP not found",
      "OTP_NOT_FOUND"
    );

  }

  // ==============================
  // Already Verified?
  // ==============================

  if (
    otpRecord.verified
  ) {

    throw new HttpError(
      409,
      "Email already verified",
      "EMAIL_ALREADY_VERIFIED"
    );

  }

  // ==============================
  // OTP Expired?
  // ==============================

  if (
    new Date() >
    otpRecord.expires_at
  ) {

    throw new HttpError(
      400,
      "OTP has expired",
      "OTP_EXPIRED"
    );

  }

  // ==============================
  // Verify OTP
  // ==============================

  const isValidOtp =
  verifyOtpHash(
    otp,
    otpRecord.otp_hash
  );

  if (
    !isValidOtp
  ) {

    throw new HttpError(
      400,
      "Invalid OTP",
      "INVALID_OTP"
    );

  }

  // ==============================
  // Mark Verified
  // ==============================

  await pool.query(

    `
    UPDATE email_otps
SET
    verified = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
    `,

    [
      otpRecord.id,
    ]

  );

  return {

    success: true,

    message:
      "Email verified successfully.",

  };

}

// ==============================
// Send Email OTP
// ==============================

async function sendEmailOtp(
  email,
  purpose = "registration"
) {

  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  // ==============================
  // Generate OTP
  // ==============================

  const otp =
    generateOtp();

  // ==============================
  // Hash OTP
  // ==============================

  const otpHash =
    hashOtp(otp);

  // ==============================
  // OTP Expiry (5 Minutes)
  // ==============================

  const expiresAt =
    new Date(
      Date.now() + 5 * 60 * 1000
    );

  // ==============================
  // Insert OR Update Existing OTP
  // ==============================

  await pool.query(
    `
    INSERT INTO email_otps
    (
      email,
      otp_hash,
      purpose,
      verified,
      expires_at
    )
    VALUES
    (
      $1,
      $2,
      $3,
      FALSE,
      $4
    )

    ON CONFLICT
    (
      email,
      purpose
    )

    DO UPDATE SET

      otp_hash = EXCLUDED.otp_hash,

      verified = FALSE,

      expires_at = EXCLUDED.expires_at,

      updated_at = CURRENT_TIMESTAMP
    `,
    [
      normalizedEmail,
      otpHash,
      purpose,
      expiresAt,
    ]
  );

  return {
    email: normalizedEmail,
    otp,
    expiresAt,
  };

}

module.exports = {
  sendEmailOtp,
  verifyOtp,
  getVerifiedOtpByEmail,
  deleteOtpByEmail,
};