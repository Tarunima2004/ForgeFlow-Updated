const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const {
  assertRequiredString,
  assertOneOf,
} = require("../utils/validators");

const authService = require("../services/auth.service");

async function register(req, res) {
  const body = await readJsonBody(req);

  const name = assertRequiredString(body.name, "name");
  const email = assertRequiredString(body.email, "email");
  const password = assertRequiredString(body.password, "password");

  const role =
    body.role === undefined
      ? "member"
      : assertOneOf(body.role, "role", ["admin", "member"]);

  const data = await authService.register({
    name,
    email,
    password,
    role,
  });

  return sendJson(res, 201, {
    success: true,
    data,
  });
}

async function login(req, res) {
  const body = await readJsonBody(req);

  const email = assertRequiredString(body.email, "email");
  const password = assertRequiredString(body.password, "password");

  const data = await authService.login({
    email,
    password,
  });

  return sendJson(res, 200, {
    success: true,
    data,
  });
}

module.exports = {
  register,
  login,
};