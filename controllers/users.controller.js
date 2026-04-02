const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const {
  assertRequiredString,
  assertOneOf,
} = require("../utils/validators");

const usersService = require("../services/users.service");

async function listUsers(req, res) {
  const users = await usersService.listUsers();

  return sendJson(res, 200, {
    success: true,
    data: users,
  });
}

async function getUserById(req, res, id) {
  const user = await usersService.getUserById(id);

  return sendJson(res, 200, {
    success: true,
    data: user,
  });
}

async function createUser(req, res) {
  const body = await readJsonBody(req);

  const name = assertRequiredString(body.name, "name");
  const email = assertRequiredString(body.email, "email");
  const password = assertRequiredString(body.password, "password");

  const role =
    body.role === undefined
      ? "member"
      : assertOneOf(body.role, "role", ["admin", "member"]);

  const user = await usersService.createUser({
    name,
    email,
    password,
    role,
  });

  return sendJson(res, 201, {
    success: true,
    data: user,
  });
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
};