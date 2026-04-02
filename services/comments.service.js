const crypto = require("crypto");
const { HttpError } = require("../utils/errors");
const { readComments, writeComments } = require("../utils/fileDb");
const { getIssueById } = require("./issues.service");
const { logActivity } = require("./activity.service");

function validateMessage(message) {
  const m = (message || "").trim();

  if (!m) {
    throw new HttpError(400, "message is required", "VALIDATION_ERROR");
  }

  if (m.length < 3) {
    throw new HttpError(
      400,
      "message must be at least 3 chars",
      "VALIDATION_ERROR"
    );
  }

  return m;
}

async function createComment({ issueId, message }) {
  // Ensure issue exists (getIssueById throws if not found)
  await getIssueById(issueId);

  const comments = await readComments();
  const now = new Date().toISOString();

  const comment = {
    id: crypto.randomUUID(),
    issueId,
    message: validateMessage(message),
    createdAt: now,
  };

  comments.push(comment);

  await writeComments(comments);

  await logActivity({
    entityType: "issue",
    entityId: issueId,
    action: "comment_added",
    message: "Comment added to issue",
  });

  return comment;
}

async function listCommentsByIssueId(issueId) {
  // Ensure issue exists
  await getIssueById(issueId);

  const comments = await readComments();

  return comments.filter((comment) => comment.issueId === issueId);
}

module.exports = {
  createComment,
  listCommentsByIssueId,
};