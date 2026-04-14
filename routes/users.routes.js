const usersController = require("../controllers/users.controller");
const { requireAuth } = require("../utils/requireAuth");
const { rateLimit } = require("../utils/rateLimiter");

const userLimiter = rateLimit({ windowMs: 10000, max: 3 });

async function handleUsersRoutes(req, res, path) {

  if (path === "/users") {
    if (req.method === "GET") {
      const user = await requireAuth(req);   // ✅ get user
      userLimiter(user.id);                  // ✅ APPLY RATE LIMIT

      await usersController.listUsers(req, res);
      return true;
    }

    if (req.method === "POST") {
      return usersController.createUser(req, res);
    }
  }

  const userMatch = path.match(/^\/users\/([^/]+)$/);

  if (userMatch) {
    const id = userMatch[1];

    if (req.method === "GET") {
      const user = await requireAuth(req);   // ✅ get user
      userLimiter(user.id);                  // ✅ APPLY RATE LIMIT

      await usersController.getUserById(req, res, id);
      return true;
    }
  }

  return false;
}

module.exports = {
  handleUsersRoutes,
};