const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const { assertRequiredString } = require("../utils/validators");

const projectMembersService = require("../services/projectMembers.service");

// ======================================
// Add Member
// ======================================

async function addMember(req, res, projectId) {

  const body =
    await readJsonBody(req);

  const userId =
    assertRequiredString(
      body.userId,
      "userId"
    );

  const member =
    await projectMembersService.addMember(
      projectId,
      userId
    );

  return sendJson(
    res,
    201,
    {
      success: true,
      data: member,
    }
  );
}

// ======================================
// List Members
// ======================================

async function listMembers(
  req,
  res,
  projectId
) {

  const members =
    await projectMembersService.listMembers(
      projectId
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: members,
    }
  );
}

// ======================================
// Remove Member
// ======================================

async function removeMember(
  req,
  res,
  projectId,
  userId
) {

  const member =
    await projectMembersService.removeMember(
      projectId,
      userId
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: member,
    }
  );
}

// ======================================
// Projects For User
// ======================================

async function listProjectsForUser(
  req,
  res,
  userId
) {

  const projects =
    await projectMembersService.listProjectsForUser(
      userId
    );

  return sendJson(
    res,
    200,
    {
      success: true,
      data: projects,
    }
  );
}

module.exports = {
  addMember,
  listMembers,
  removeMember,
  listProjectsForUser,
};