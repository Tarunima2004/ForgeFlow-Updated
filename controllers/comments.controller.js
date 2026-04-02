const sendJson = require("../utils/sendJson");
const { readJsonBody } = require("../utils/request");
const { assertRequiredString } = require("../utils/validators");
const commentsService = require("../services/comments.service");

async function createComment(req, res, issueId) {
  const body = await readJsonBody(req);

  const message = assertRequiredString(body.message, "message");

  const comment = await commentsService.createComment({
    issueId,
    message,
  });

  return sendJson(res, 201, {
    success: true,
    data: comment,
  });
}

async function listCommentsForIssue(req, res, issueId) {
  const comments = await commentsService.listCommentsByIssueId(issueId);

  return sendJson(res, 200, {
    success: true,
    data: comments,
  });
}

module.exports = {
  createComment,
  listCommentsForIssue,
};