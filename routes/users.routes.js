const usersController = require("../controllers/users.controller");

function handleUsersRoutes(req, res, path) {
  // /users
  if (path === "/users") {
    if (req.method === "GET") {
      return usersController.listUsers(req, res);
    }

    if (req.method === "POST") {
      return usersController.createUser(req, res);
    }
  }

  // /users/:id
  const userMatch = path.match(/^\/users\/([^/]+)$/);

  if (userMatch) {
    const id = userMatch[1];

    if (req.method === "GET") {
      return usersController.getUserById(req, res, id);
    }
  }

  return false;
}

module.exports = {
  handleUsersRoutes,
};