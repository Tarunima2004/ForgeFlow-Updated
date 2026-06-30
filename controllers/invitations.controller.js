const sendJson =
  require("../utils/sendJson");

const {
  readJsonBody,
} = require("../utils/request");

const {
  assertRequiredString,
  assertOneOf,
} =
require("../utils/validators");

const invitationsService =
require("../services/invitations.service");

async function createInvitation(
  req,
  res
) {

  try {

    const body =
      await readJsonBody(req);

    const email =
      assertRequiredString(
        body.email,
        "email"
      );

    const name =
      assertRequiredString(
        body.name,
        "name"
      );

    const password =
      assertRequiredString(
        body.password,
        "password"
      );
const role = "member";
    const invitation =
      await invitationsService.createInvitation({

        email,

        name,

        password,

        role,
        invitedBy:
      req.user.id,

      });

    return sendJson(
      res,
      201,
      {
        success: true,
        data: invitation,
      }
    );

  }

  catch (error) {

    return sendJson(
      res,
      error.statusCode || 500,
      {

        success: false,
        message:
          error.message,
        code:
          error.code,
      }
    );
  }
}
module.exports = {
  createInvitation,
};