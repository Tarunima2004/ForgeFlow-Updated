const crypto = require("crypto");
const pool = require("../utils/db");
const { HttpError } = require("../utils/errors");
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

// ✅ CREATE COMMENT
async function createComment({ issueId, message }) {
  // Ensure issue exists
  await getIssueById(issueId);

  const now = new Date().toISOString();

  const result = await pool.query(
    `INSERT INTO comments (id, issue_id, message, created_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      crypto.randomUUID(),
      issueId,
      validateMessage(message),
      now,
    ]
  );

  const row = result.rows[0];

  const comment = {
    id: row.id,
    issueId: row.issue_id,
    message: row.message,
    createdAt: row.created_at,
  };

  await logActivity({
    entityType: "issue",
    entityId: issueId,
    action: "comment_added",
    message: "Comment added to issue",
  });

  return comment;
}

// ✅ LIST COMMENTS BY ISSUE ID
async function listCommentsByIssueId(issueId) {
  // Ensure issue exists
  await getIssueById(issueId);

  const result = await pool.query(
    `SELECT * FROM comments
     WHERE issue_id = $1
     ORDER BY created_at ASC`,
    [issueId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    issueId: row.issue_id,
    message: row.message,
    createdAt: row.created_at,
  }));
}

module.exports = {
  createComment,
  listCommentsByIssueId,
};