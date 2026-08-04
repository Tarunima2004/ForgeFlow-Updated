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
async function validateParentComment({
  issueId,
  parentCommentId,
}) {

  // Top-level comment
  if (!parentCommentId) {
    return null;
  }

  const result = await pool.query(
    `
    SELECT
      id,
      issue_id,
      parent_comment_id,
      is_deleted
    FROM comments
    WHERE id = $1
    `,
    [parentCommentId]
  );

  const parentComment = result.rows[0];

  // Parent comment does not exist
  if (!parentComment) {
    throw new HttpError(
      404,
      "Parent comment not found",
      "COMMENT_NOT_FOUND"
    );
  }

  // Parent belongs to another issue
  if (parentComment.issue_id !== issueId) {
    throw new HttpError(
      400,
      "Parent comment belongs to another issue",
      "INVALID_PARENT_COMMENT"
    );
  }

  // Parent is deleted
  if (parentComment.is_deleted) {
    throw new HttpError(
      400,
      "Cannot reply to a deleted comment",
      "COMMENT_DELETED"
    );
  }

  // Jira supports only ONE reply level
  if (parentComment.parent_comment_id !== null) {
    throw new HttpError(
      400,
      "Replies cannot have replies",
      "INVALID_REPLY_PARENT"
    );
  }

  return parentComment;
}
// ✅ CREATE COMMENT
async function createComment({
  issueId,
  content,
  parentCommentId = null,
  createdBy,
}) {

  // Ensure issue exists
  await getIssueById(issueId);

  // Validate content
  const validatedContent =
    validateMessage(content);

  // Validate parent comment (for replies)
  await validateParentComment({
  issueId,
  parentCommentId,
});
  const result =
    await pool.query(
      `
      INSERT INTO comments (
        id,
        issue_id,
        parent_comment_id,
        content,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $5,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING *
      `,
      [
        crypto.randomUUID(),
        issueId,
        parentCommentId,
        validatedContent,
        createdBy,
      ]
    );

  const row = result.rows[0];

  await logActivity({
    entityType: "issue",
    entityId: issueId,
    action: "comment_added",
    message:
      parentCommentId
        ? "Reply added"
        : "Comment added",
    userId: createdBy,
  });

  return {
    id: row.id,
    issueId: row.issue_id,
    parentCommentId:
      row.parent_comment_id,
    content: row.content,
    createdBy:
      row.created_by,
    updatedBy:
      row.updated_by,
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
    editedAt:
      row.edited_at,
    isDeleted:
      row.is_deleted,
  };
}
function buildCommentTree(comments) {

  const commentMap = new Map();

  const rootComments = [];

  // Pass 1
  comments.forEach((comment) => {

    commentMap.set(
      comment.id,
      {
        ...comment,
        replies: [],
      }
    );

  });

  // Pass 2
  commentMap.forEach((comment) => {

    if (!comment.parentCommentId) {

      rootComments.push(comment);

      return;
    }

    const parent =
      commentMap.get(
        comment.parentCommentId
      );

    if (parent) {
      parent.replies.push(comment);
    }

  });

  return rootComments;

}
// ✅ LIST COMMENTS BY ISSUE ID
async function listCommentsByIssueId(issueId) {

  // Ensure issue exists
  await getIssueById(issueId);

  const result = await pool.query(
    `
    SELECT

      c.id,
      c.issue_id,
      c.parent_comment_id,
      c.content,
      c.created_by,
      c.created_at,
      c.updated_at,
      c.edited_at,

      u.name,
      u.email

    FROM comments c

    JOIN users u
      ON u.id = c.created_by

    WHERE c.issue_id = $1
      AND c.is_deleted = FALSE

    ORDER BY c.created_at ASC
    `,
    [issueId]
  );

  const comments = result.rows.map((row) => ({

  id: row.id,

  issueId: row.issue_id,

  parentCommentId:
    row.parent_comment_id,

  content:
    row.content,

  author: {

    id:
      row.created_by,

    name:
      row.name,

    email:
      row.email,

  },

  createdAt:
    row.created_at,

  updatedAt:
    row.updated_at,

  editedAt:
    row.edited_at,

}));

return buildCommentTree(comments);
}
async function updateComment({
  commentId,
  content,
  updatedBy,
}) {
  // Validate content
  const validatedContent =validateMessage(content);

  // Ensure comment exists
  const existingResult = await pool.query(
    `
    SELECT *
    FROM comments
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [commentId]
  );

  if (existingResult.rows.length === 0) {
    throw new HttpError(
      404,
      "Comment not found",
      "COMMENT_NOT_FOUND"
    );
  }

  const existingComment = existingResult.rows[0];

  const result = await pool.query(
    `
    UPDATE comments
    SET
      content = $1,
      updated_by = $2,
      updated_at = CURRENT_TIMESTAMP,
      edited_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
    `,
    [
      validatedContent,
      updatedBy,
      commentId,
    ]
  );

  const row = result.rows[0];

  await logActivity({
    entityType: "issue",
    entityId: row.issue_id,
    action: "comment_updated",
    message: "Comment edited",
    userId: updatedBy,
  });

  return {
    id: row.id,
    issueId: row.issue_id,
    parentCommentId: row.parent_comment_id,
    content: row.content,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    editedAt: row.edited_at,
    isDeleted: row.is_deleted,
  };
}
async function deleteComment({
  commentId,
  deletedBy,
}) {
  // Ensure comment exists
  const existingResult = await pool.query(
    `
    SELECT *
    FROM comments
    WHERE id = $1
      AND is_deleted = FALSE
    `,
    [commentId]
  );

  if (existingResult.rows.length === 0) {
    throw new HttpError(
      404,
      "Comment not found",
      "COMMENT_NOT_FOUND"
    );
  }

  const existingComment = existingResult.rows[0];

  await pool.query(
    `
    UPDATE comments
    SET
      is_deleted = TRUE,
      updated_by = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    `,
    [
      deletedBy,
      commentId,
    ]
  );

  await logActivity({
    entityType: "issue",
    entityId: existingComment.issue_id,
    action: "comment_deleted",
    message: "Comment deleted",
    userId: deletedBy,
  });

  return {
    success: true,
    message: "Comment deleted successfully",
  };
}
async function getCommentWithProject(commentId) {

  const result = await pool.query(
    `
    SELECT

      c.id,

      c.issue_id
        AS "issueId",

      c.parent_comment_id
        AS "parentCommentId",

      c.created_by
        AS "createdBy",

      c.is_deleted
        AS "isDeleted",

      i.project_id
        AS "projectId",

      i.status
        AS "issueStatus"

    FROM comments c

    INNER JOIN issues i
      ON i.id = c.issue_id

    WHERE c.id = $1
    `,
    [commentId]
  );

  const comment =
    result.rows[0];

  if (!comment) {
    throw new HttpError(
      404,
      "Comment not found",
      "COMMENT_NOT_FOUND"
    );
  }

  return comment;

}
async function getProjectMembership({
  projectId,
  userId,
}) {

  const result = await pool.query(
    `
    SELECT
      user_id,
      project_id,
      permission_role
    FROM project_members
    WHERE project_id = $1
      AND user_id = $2
    `,
    [
      projectId,
      userId,
    ]
  );

  return result.rows[0] || null;

}
async function canEditComment(
  comment,
  user
) {

  // Global Admin
  if (user.role === "admin") {
    return;
  }

  // Deleted comment
  if (comment.isDeleted) {
    throw new HttpError(
      403,
      "Deleted comments cannot be edited",
      "COMMENT_DELETED"
    );
  }

  const membership =
    await getProjectMembership({
      projectId:
        comment.projectId,
      userId:
        user.id,
    });

  // Project Manager
  if (
    membership &&
    membership.permission_role ===
      "manager"
  ) {
    return;
  }

  // Comment Author
  if (
    comment.createdBy ===
    user.id
  ) {
    return;
  }

  throw new HttpError(
    403,
    "You do not have permission to edit this comment",
    "FORBIDDEN"
  );

}
async function canDeleteComment(
  comment,
  user
) {

  // Global Admin
  if (user.role === "admin") {
    return;
  }

  // Deleted comment
  if (comment.isDeleted) {
    throw new HttpError(
      403,
      "Comment already deleted",
      "COMMENT_DELETED"
    );
  }

  const membership =
    await getProjectMembership({
      projectId:
        comment.projectId,
      userId:
        user.id,
    });

  // Project Manager
  if (
    membership &&
    membership.permission_role ===
      "manager"
  ) {
    return;
  }

  // Comment Author
  if (
    comment.createdBy ===
    user.id
  ) {
    return;
  }

  throw new HttpError(
    403,
    "You do not have permission to delete this comment",
    "FORBIDDEN"
  );

}
async function canCreateComment({
  projectId,
  user,
}) {

  // Global Admin
  if (user.role === "admin") {
    return;
  }

  const membership =
    await getProjectMembership({
      projectId,
      userId:
        user.id,
    });

  if (membership) {
    return;
  }

  throw new HttpError(
    403,
    "You are not a member of this project",
    "FORBIDDEN"
  );

}
module.exports = {
  createComment,
  listCommentsByIssueId,
  updateComment,
  deleteComment,
};