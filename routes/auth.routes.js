const authController = require("../controllers/auth.controller");

function handleAuthRoutes(req, res, path) {
  console.log("DEBUG AUTH ROUTE CHECK =>", req.method, path);

  if (path === "/auth/register" && req.method === "POST") {
    console.log("DEBUG AUTH REGISTER MATCHED");
    authController.register(req, res);
    return true; // ✅ VERY IMPORTANT
  }

  if (path === "/auth/login" && req.method === "POST") {
    console.log("DEBUG AUTH LOGIN MATCHED");
    authController.login(req, res);
    return true; // ✅ VERY IMPORTANT
  }

  return false;
}
module.exports = {
  handleAuthRoutes,
};