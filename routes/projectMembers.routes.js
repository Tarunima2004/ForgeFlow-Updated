const projectMembersController =
  require("../controllers/projectMembers.controller");

async function handleProjectMembersRoutes(
  req,
  res,
  path
) {

  // ====================================
  // POST /projects/:projectId/members
  // GET  /projects/:projectId/members
  // ====================================

  const membersMatch =
    path.match(
      /^\/projects\/([^/]+)\/members$/
    );

  if (membersMatch) {

    const projectId =
      membersMatch[1];

    if (req.method === "POST") {

      await projectMembersController.addMember(
        req,
        res,
        projectId
      );

      return true;
    }

    if (req.method === "GET") {

      await projectMembersController.listMembers(
        req,
        res,
        projectId
      );

      return true;
    }

    return false;
  }

  // ====================================
  // DELETE
  // /projects/:projectId/members/:userId
  // ====================================

  const removeMatch =
    path.match(
      /^\/projects\/([^/]+)\/members\/([^/]+)$/
    );

  if (removeMatch) {

    const projectId =
      removeMatch[1];

    const userId =
      removeMatch[2];

    if (req.method === "DELETE") {

      await projectMembersController.removeMember(
        req,
        res,
        projectId,
        userId
      );

      return true;
    }

    return false;
  }

  // ====================================
  // GET /users/:id/projects
  // ====================================

  const userProjectsMatch =
    path.match(
      /^\/users\/([^/]+)\/projects$/
    );

  if (userProjectsMatch) {

    const userId =
      userProjectsMatch[1];

    if (req.method === "GET") {

      await projectMembersController.listProjectsForUser(
        req,
        res,
        userId
      );

      return true;
    }

    return false;
  }

  return false;
}

module.exports = {
  handleProjectMembersRoutes,
};