const usersController = require("../controllers/users.controller");
const { requireAuth } = require("../utils/requireAuth");
const { rateLimit } = require("../utils/rateLimiter");
const sendJson = require("../utils/sendJson");

const userLimiter = rateLimit({ windowMs: 10000, max: 3 });

async function handleUsersRoutes(req, res, path) {
  if (path === "/users") {
    if (req.method === "GET") {
      const user = await requireAuth(req);
      userLimiter(user.id);

      await usersController.listUsers(req, res);
      return true;
    }

    if (req.method === "POST") {
      const user = await requireAuth(req);
      userLimiter(user.id);

      if (user.role !== "admin") {
        return sendJson(res, 403, {
          success: false,
          message: "Only admins can create users",
        });
      }

      await usersController.createUser(req, res);
      return true;
    }

    return false;
  }

  // /users/job-roles
if (path === "/users/job-roles") {
  if (req.method === "GET") {
    await usersController.getJobRoles(req, res);
    return true;
  }

  return false;
}
  // /users/:id
  const userMatch = path.match(/^\/users\/([^/]+)$/);

  if (userMatch) {
    const id = userMatch[1];

    if (req.method === "GET") {
      const user = await requireAuth(req);
      userLimiter(user.id);

      await usersController.getUserById(req, res, id);
      return true;
    }

    return false;
  }

  return false;
}

module.exports = {
  handleUsersRoutes,
};