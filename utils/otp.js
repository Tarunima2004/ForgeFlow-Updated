const crypto = require("crypto");

// ==============================
// Generate 6 Digit OTP
// ==============================

function generateOtp() {

  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();

}

// ==============================
// Hash OTP
// ==============================

function hashOtp(otp) {

  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

}

// ==============================
// Verify OTP
// ==============================

function verifyOtp(
  enteredOtp,
  storedOtpHash
) {

  const enteredOtpHash =
    hashOtp(enteredOtp);

  return (
    enteredOtpHash ===
    storedOtpHash
  );

}

module.exports = {

  generateOtp,

  hashOtp,

  verifyOtp,

};