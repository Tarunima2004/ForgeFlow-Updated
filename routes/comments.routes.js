const commentsController = require("../controllers/comments.controller");

async function handleCommentsRoutes(req, res, path) {

  if (!path.startsWith("/comments")) {
    return false;
  }

  // /comments/:commentId
  const commentMatch = path.match(
    /^\/comments\/([^/]+)$/
  );

  if (commentMatch) {

    const commentId = commentMatch[1];

    if (req.method === "PATCH") {

      await commentsController.updateComment(
        req,
        res,
        commentId
      );

      return true;
    }

    if (req.method === "DELETE") {

      await commentsController.deleteComment(
        req,
        res,
        commentId
      );

      return true;
    }

    return false;
  }

  return false;
}

module.exports = {
  handleCommentsRoutes,
};