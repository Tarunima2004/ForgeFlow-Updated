const invitationsController =
  require("../controllers/invitations.controller");

const { requireAuth } =
  require("../utils/requireAuth");

const sendJson =
  require("../utils/sendJson");

const {
  sendTestEmail,
} = require("../services/email.service");

async function handleInvitationRoutes(
  req,
  res,
  path
) {

  // ====================================
  // POST /invitations
  // ====================================

  if (
    path === "/invitations"
  ) {

    if (
      req.method === "POST"
    ) {

      const user =
        await requireAuth(req);

      if (
        user.role !== "admin"
      ) {

        return sendJson(
          res,
          403,
          {
            success: false,
            message:
              "Only admins can invite users",
          }
        );
      }
      await invitationsController.createInvitation(
        req,
        res
      );
      return true;
    }
    return false;
  }
  // ====================================
  // POST /invitations/test-email
  // ====================================
  // ====================================
// POST /invitations/test-email
// ====================================

if (
  path === "/invitations/test-email"
) {

  if (
    req.method === "POST"
  ) {

    await sendTestEmail();

    sendJson(
      res,
      200,
      {
        success: true,
        message:
          "Test email sent successfully.",
      }
    );

    return true;

  }

  return false;

}
}
module.exports = {
  handleInvitationRoutes,
};