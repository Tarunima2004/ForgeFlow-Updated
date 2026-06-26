const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const {
  assertRequiredString,
  assertOneOf,
} = require("../utils/validators");

const authService = require("../services/auth.service");

async function register(req, res) {

  try {

    const body =
      await readJsonBody(req);

    const name =
      assertRequiredString(
        body.name,
        "name"
      );

    const email =
      assertRequiredString(
        body.email,
        "email"
      );

    const password =
      assertRequiredString(
        body.password,
        "password"
      );

    const role = "member";
    const dept =
  assertOneOf(
    body.dept,
    "dept",
    [
      "Engineering",
      "Fashion",
      "Finance",
      "Electronics",
      "Biotech",
    ]
  );
  const jobRole =
  assertRequiredString(
    body.jobRole,
    "jobRole"
  );

const phoneNumber =
  assertRequiredString(
    body.phoneNumber,
    "phoneNumber"
  );
    const data =
      await authService.register({
        name,
        email,
        password,
        role,
        dept,
        jobRole,
        phoneNumber,
      });

    return sendJson(
      res,
      201,
      {
        success: true,
        data,
      }
    );

  } catch (error) {

    return sendJson(
      res,
      error.statusCode || 500,
      {
        success: false,
        message:
          error.message ||
          "Internal Server Error",
        code:
          error.code ||
          "INTERNAL_SERVER_ERROR",
      }
    );
  }
}
async function login(req, res) {

  try {

    const body = await readJsonBody(req);

    const email =
      assertRequiredString(
        body.email,
        "email"
      );

    const password =
      assertRequiredString(
        body.password,
        "password"
      );

    const data =
      await authService.login({
        email,
        password,
      });

    return sendJson(
      res,
      200,
      {
        success: true,
        data,
      }
    );

  } catch (error) {

    return sendJson(
      res,
      error.statusCode || 500,
      {
        success: false,
        message:
          error.message ||
          "Internal Server Error",
        code:
          error.code ||
          "INTERNAL_SERVER_ERROR",
      }
    );
  }
}
module.exports = {
  register,
  login,
};