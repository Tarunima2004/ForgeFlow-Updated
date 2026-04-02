const authController = require("../controllers/auth.controller");

function handleAuthRoutes(req, res, path) {
  console.log("DEBUG AUTH ROUTE CHECK =>", req.method, path);

  if (path === "/auth/register") {
    if (req.method === "POST") {
      console.log("DEBUG AUTH REGISTER MATCHED");
      return authController.register(req, res);
    }
  }

  if (path === "/auth/login") {
    if (req.method === "POST") {
      console.log("DEBUG AUTH LOGIN MATCHED");
      return authController.login(req, res);
    }
  }

  return false;
}

module.exports = {
  handleAuthRoutes,
};