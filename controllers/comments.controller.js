const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const { assertRequiredString } = require("../utils/validators");
const commentsService = require("../services/comments.service");
const { requireAuth } = require("../utils/requireAuth");
const { requireRole } = require("../utils/requireRole");

// ==============================
// Create Comment
// ==============================
async function createComment(req, res, issueId) {
  await requireAuth(req);

  requireRole(req.user, [
    "admin",
    "member",
  ]);
  const body = await readJsonBody(req);

  const content = assertRequiredString(body.content, "content");

  const comment = await commentsService.createComment({
    issueId,
    content,
    parentCommentId: body.parentCommentId || null,
    createdBy: req.user.id,
  });

  return sendJson(res, 201, {
    success: true,
    data: comment,
  });
}

// ==============================
// List Comments
// ==============================
async function listCommentsForIssue(req, res, issueId) {
  await requireAuth(req);

  requireRole(req.user, [
    "admin",
    "member",
  ]);
  const comments =
    await commentsService.listCommentsByIssueId(issueId);

  return sendJson(res, 200, {
    success: true,
    data: comments,
  });
}

// ==============================
// Update Comment
// ==============================
async function updateComment(req, res, commentId) {
  await requireAuth(req);

  requireRole(req.user, [
    "admin",
    "member",
  ]);
  const body = await readJsonBody(req);

  const content = assertRequiredString(body.content, "content");

  const comment = await commentsService.updateComment({
    commentId,
    content,
    updatedBy: req.user.id,
  });

  return sendJson(res, 200, {
    success: true,
    data: comment,
  });
}

// ==============================
// Delete Comment
// ==============================
async function deleteComment(req, res, commentId) {
  await requireAuth(req);

  requireRole(req.user, [
    "admin",
    "member",
  ]);
  const result =
    await commentsService.deleteComment({
      commentId,
      deletedBy: req.user.id,
    });

  return sendJson(res, 200, {
    success: true,
    data: result,
  });
}

module.exports = {
  createComment,
  listCommentsForIssue,
  updateComment,
  deleteComment,
};