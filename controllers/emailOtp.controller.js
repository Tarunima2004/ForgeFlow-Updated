const sendJson =
  require("../utils/sendJson");

const {
  readJsonBody,
} = require("../utils/request");

const {
  assertRequiredString,
} = require("../utils/validators");

const {
  sendEmailOtp,
  verifyOtp,
} = require("../services/emailOtp.service");

const {
  sendOtpEmail,
} = require("../services/email.service");
// ==============================
// Send Email OTP
// ==============================

async function sendOtp(
  req,
  res
) {

  try {

    const body =
      await readJsonBody(req);

    const email =
      assertRequiredString(
        body.email,
        "email"
      );

    const otpData =
      await sendEmailOtp(
        email
      );

    await sendOtpEmail({

      email:
        otpData.email,

      otp:
        otpData.otp,

    });

    return sendJson(
      res,
      200,
      {

        success: true,

        message:
          "OTP sent successfully.",

      }
    );

  }

  catch (error) {

    return sendJson(
      res,
      error.statusCode || 500,
      {

        success: false,

        message:
          error.message,

        code:
          error.code,
      }
    );
  }
}
// ==============================
// Verify Email OTP
// ==============================

async function verifyEmailOtp(
  req,
  res
) {

  try {

    const body =
      await readJsonBody(req);

    const email =
      assertRequiredString(
        body.email,
        "email"
      );

    const otp =
      assertRequiredString(
        body.otp,
        "otp"
      );

    const result =
      await verifyOtp({

        email,

        otp,

      });

    return sendJson(
      res,
      200,
      result
    );

  }

  catch (error) {

    return sendJson(

      res,

      error.statusCode || 500,

      {

        success: false,

        message:
          error.message,

        code:
          error.code,

      }

    );

  }

}
module.exports = {
  sendOtp,
  verifyEmailOtp,
};