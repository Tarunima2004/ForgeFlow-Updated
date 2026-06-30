const emailOtpController =
  require("../controllers/emailOtp.controller");

async function handleEmailOtpRoutes(
  req,
  res,
  path
) {

  // ====================================
  // POST /auth/send-email-otp
  // ====================================

  if (
    path === "/auth/send-email-otp"
  ) {

    if (
      req.method === "POST"
    ) {

      await emailOtpController.sendOtp(
        req,
        res
      );

      return true;

    }

    return false;

  }

  // ====================================
  // POST /auth/verify-email-otp
  // ====================================

  if (
    path === "/auth/verify-email-otp"
  ) {

    if (
      req.method === "POST"
    ) {

      await emailOtpController.verifyEmailOtp(
        req,
        res
      );

      return true;

    }

    return false;

  }

  return false;

}

module.exports = {
  handleEmailOtpRoutes,
};