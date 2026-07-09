const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const {
  assertRequiredString,
  assertOneOf,
} = require("../utils/validators");

const usersService = require("../services/users.service");
const {
  requireAuth,
} = require("../utils/requireAuth");

const {
  requireRole,
} = require("../utils/requireRole");


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

  const role =
    body.role === undefined
      ? "member"
      : assertOneOf(
          body.role,
          "role",
          [
            "admin",
            "member",
          ]
        );

  const user =
    await usersService.createUser({
      name,
      email,
      password,
      role,
      dept,
    });

  return sendJson(
    res,
    201,
    {
      success: true,
      data: user,
    }
  );

}
async function getJobRoles(req, res) {

  const data =
    await usersService.getJobRoles();

  return sendJson(
    res,
    200,
    {
      success: true,
      data,
    }
  );

}
async function updateUserRole(
  req,
  res,
  id
) {

  await requireAuth(req);

  requireRole(
    req.user,
    ["admin"]
  );

  const body =
    await readJsonBody(req);

  const updatedUser =
    await usersService.updateUserRole(

      id,

      body.role,

      req.user

    );

  return sendJson(
    res,
    200,
    {
      success: true,
      message:
        "User role updated successfully",
      data:
        updatedUser,
    }
  );

}
module.exports = {
  listUsers,
  getUserById,
  createUser,
  getJobRoles,
  updateUserRole,
};