const crypto = require("crypto");
const pool = require("../utils/db");
const { assertFound } = require("../utils/errors");
const { getUserSnapshot } = require("../utils/authUserSnapshot");
const {
  assertRequiredString,
  assertOneOf,
  assertMinLength,
  assertValidDate,
} = require("../utils/validators");
const { logActivity } = require("./activity.service");

function assertAllowedStatus(status) {
  return assertOneOf(status, "status", ["backlog","todo", "in_progress", "done"]);
}

function validateTitle(title) {
  const t = assertRequiredString(title, "title");
  return assertMinLength(t, "title", 4);
}

function validatePriority(priority) {
  if (priority === undefined) return "medium";

  const p = String(priority).trim().toLowerCase();
  assertOneOf(p, "priority", ["low", "medium", "high", "critical"]);

  return p;
}

function validateDueDate(dueDate) {
  const validated = assertValidDate(dueDate, "dueDate");

  if (validated === undefined || validated === null) {
    return null;
  }

  return new Date(validated).toISOString();
}

function validateAssignedTo(assignedTo) {
  const a = assertRequiredString(assignedTo, "assignedTo");
  return assertMinLength(a, "assignedTo", 2);
}

// ✅ Ensure project exists
async function ensureProjectExists(projectId) {
  console.log("PROJECT ID CHECK:", projectId);

  const result = await pool.query(
    "SELECT id FROM projects WHERE id = $1",
    [projectId]
  );

  console.log("DB RESULT:", result.rows);

  assertFound(result.rows[0], "Project not found");
}

// ✅ Get next rank
async function getNextRankForProject(projectId) {
  const result = await pool.query(
    "SELECT MAX(rank) as max_rank FROM issues WHERE project_id = $1",
    [projectId]
  );

  const max = result.rows[0].max_rank;

  return max ? max + 1 : 1;
}

// ✅ Create issue with transaction
async function createIssue(
  { title, projectId = null, labels = [], priority, dueDate, assignedTo },
  currentUser
) {
  console.log("BODY RECEIVED:", { title, projectId });

  const client = await pool.connect();

  try {
    // ✅ START TRANSACTION
    await client.query("BEGIN");

    if (projectId) {
      projectId = projectId.trim();
      await ensureProjectExists(projectId);
    }

    const now = new Date().toISOString();
    const userId = currentUser.id;

    const rank = projectId
      ? await getNextRankForProject(projectId)
      : null;

    // ✅ INSERT ISSUE
    const result = await client.query(
      `INSERT INTO issues
       (id, title, project_id, status, priority, due_date, rank, assigned_to, created_by, updated_by, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        crypto.randomUUID(),
        validateTitle(title),
        projectId,
        "backlog",
        validatePriority(priority),
        validateDueDate(dueDate),
        rank,
        assignedTo !== undefined
          ? validateAssignedTo(assignedTo)
          : null,
        userId,
        userId,
        now,
        now,
      ]
    );

    const issue = result.rows[0];

    // ✅ LOG ACTIVITY
    await logActivity({
      entityType: "issue",
      entityId: issue.id,
      action: "issue_created",
      message: `Issue "${issue.title}" created`,
    });

    // ✅ SAVE CHANGES
    await client.query("COMMIT");

    return issue;

  } catch (err) {

    // ❌ UNDO CHANGES IF ERROR HAPPENS
    await client.query("ROLLBACK");

    throw err;

  } finally {

    // ✅ RELEASE CONNECTION
    client.release();
  }
}

// ✅ List all issues
async function listIssues({
  status,
  q,
  priority,
  assignedTo,
  sort = "createdAt",
  order = "desc",
  page = 1,
  limit = 10,
  view,
}) {
  const values = [];
  const conditions = [];

  // Status filter
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }
if (q) {
  values.push(`%${q.trim()}%`);
  conditions.push(`title ILIKE $${values.length}`);
}
  // Priority filter
  if (priority) {
    values.push(priority);
    conditions.push(`priority = $${values.length}`);
  }

  // Assigned user filter
  if (assignedTo) {
    values.push(assignedTo);
    conditions.push(`assigned_to = $${values.length}`);
  }

  let query = `
    SELECT *
    FROM issues
  `;

  // WHERE clause
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  // Safe sort mapping
  const sortMap = {
    createdAt: "created_at",
    updatedAt: "updated_at",
  };

  if (view === "board") {

  query += `
    ORDER BY
      status ASC,
      rank ASC NULLS LAST
  `;

} else {

  const sortColumn =
    sortMap[sort] || "created_at";

  query += `
    ORDER BY ${sortColumn}
    ${order.toUpperCase()}
  `;

}

  const offset = (page - 1) * limit;

  values.push(limit);
  values.push(offset);

  query += `
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const result = await pool.query(
    query,
    values
  );

  // Count query for pagination metadata
  let countQuery = `
    SELECT COUNT(*) AS total
    FROM issues
  `;

  if (conditions.length > 0) {
    countQuery += `
      WHERE ${conditions.join(" AND ")}
    `;
  }

  const countResult = await pool.query(
    countQuery,
    values.slice(0, conditions.length)
  );

  const total = Number(
    countResult.rows[0].total
  );

  return {
    success: true,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(
        1,
        Math.ceil(total / limit)
      ),
    },
    data: result.rows,
  };
}
// ✅ Get issue by id
async function getIssueById(id) {
  const result = await pool.query(
    "SELECT * FROM issues WHERE id = $1",
    [id]
  );

  const issue = result.rows[0];

  assertFound(issue, "Issue not found");

  return issue;
}

// ✅ Update issue
async function updateIssue(
  id,
  { title, status, labels, priority, dueDate, assignedTo },
  currentUser
) {
  const existing = await getIssueById(id);

  const oldStatus = existing.status;

  const nextStatus =
    status !== undefined
      ? (assertAllowedStatus(status), status)
      : existing.status;

  const updated = await pool.query(
    `UPDATE issues SET
     title = $1,
     status = $2,
     priority = $3,
     due_date = $4,
     assigned_to = $5,
     updated_by = $6,
     updated_at = $7
     WHERE id = $8
     RETURNING *`,
    [
      title !== undefined
        ? validateTitle(title)
        : existing.title,

      nextStatus,

      priority !== undefined
        ? validatePriority(priority)
        : existing.priority || "medium",

      dueDate !== undefined
        ? validateDueDate(dueDate)
        : existing.due_date || null,

      assignedTo !== undefined
        ? assignedTo === null
          ? null
          : validateAssignedTo(assignedTo)
        : existing.assigned_to,

      currentUser.id,
      new Date().toISOString(),
      id,
    ]
  );

  const updatedIssue = updated.rows[0];

  const statusChanged = oldStatus !== updatedIssue.status;
  if (statusChanged) {

  await pool.query(
    `
    INSERT INTO issue_status_history
    (
      issue_id,
      from_status,
      to_status,
      changed_by
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    `,
    [
      updatedIssue.id,
      oldStatus,
      updatedIssue.status,
      currentUser.id,
    ]
  );

}

  await logActivity({
    entityType: "issue",
    entityId: updatedIssue.id,
    action: statusChanged
      ? "issue_status_changed"
      : "issue_updated",

    message: statusChanged
      ? `Issue status changed from ${oldStatus} to ${updatedIssue.status}`
      : `Issue "${updatedIssue.title}" updated`,
  });

  return updatedIssue;
}

// ✅ Assign issue
async function assignIssueById(id, { assignedTo }, currentUser) {
  const updated = await pool.query(
    `UPDATE issues SET
     assigned_to = $1,
     updated_by = $2,
     updated_at = $3
     WHERE id = $4
     RETURNING *`,
    [
      validateAssignedTo(assignedTo),
      currentUser.id,
      new Date().toISOString(),
      id,
    ]
  );

  const issue = updated.rows[0];

  assertFound(issue, "Issue not found");

  await logActivity({
    entityType: "issue",
    entityId: issue.id,
    action: "issue_assigned",
    message: `Issue assigned to ${issue.assigned_to}`,
  });

  return issue;
}

// ✅ Delete issue
async function deleteIssue(id) {
  const result = await pool.query(
    "DELETE FROM issues WHERE id = $1 RETURNING *",
    [id]
  );

  const issue = result.rows[0];

  assertFound(issue, "Issue not found");

  await logActivity({
    entityType: "issue",
    entityId: issue.id,
    action: "issue_deleted",
    message: `Issue "${issue.title}" deleted`,
  });

  return issue;
}

// ✅ List issues by project
async function listIssuesByProjectId(projectId) {
  await ensureProjectExists(projectId);

  const result = await pool.query(
    `SELECT * FROM issues
     WHERE project_id = $1
     ORDER BY rank ASC NULLS LAST`,
    [projectId]
  );

  return result.rows;
}
async function reorderIssues(
  issues,
  currentUser
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const item of issues) {

  // Get current status first

  const existingIssue =
    await client.query(
      `
      SELECT id, status
      FROM issues
      WHERE id = $1
      `,
      [item.issueId]
    );

  const oldStatus =
    existingIssue.rows[0].status;

  // Update issue

  await client.query(
    `
    UPDATE issues
    SET status = $1,
        rank = $2,
        updated_by = $3,
        updated_at = $4
    WHERE id = $5
    `,
    [
      item.status,
      item.rank,
      currentUser.id,
      new Date().toISOString(),
      item.issueId,
    ]
  );

  // Status changed?

  if (
    oldStatus !== item.status
  ) {
    await client.query(
  `
  INSERT INTO issue_status_history
  (
    issue_id,
    from_status,
    to_status,
    changed_by
  )
  VALUES
  (
    $1,
    $2,
    $3,
    $4
  )
  `,
  [
    item.issueId,
    oldStatus,
    item.status,
    currentUser.id,
  ]
);
    await logActivity(
  {
    entityType: "issue",
    entityId: item.issueId,
    action: "issue_status_changed",
    message: `Issue moved from ${oldStatus} to ${item.status}`,
    metadata: {
      fromStatus: oldStatus,
      toStatus: item.status,
    },
  },
  client
);
  } else {

   await logActivity(
  {
    entityType: "issue",
    entityId: item.issueId,
    action: "issue_reordered",
    message: "Issue reordered on board",
  },
  client
);
  }
}

    await client.query("COMMIT");

    return {
      success: true,
    };

  } catch (error) {

    await client.query("ROLLBACK");

    throw error;

  } finally {

    client.release();

  }
}
async function getIssueKPIs() {

  const result = await pool.query(
    `
    SELECT

      COUNT(*) AS total_issues,

      COUNT(*) FILTER (
        WHERE status != 'done'
      ) AS open_issues,

      COUNT(*) FILTER (
        WHERE status = 'in_progress'
      ) AS in_progress,

      COUNT(*) FILTER (
        WHERE status = 'done'
      ) AS resolved,

      COUNT(*) FILTER (
        WHERE priority = 'critical'
      ) AS critical,

      COUNT(*) FILTER (
        WHERE due_date < NOW()
        AND status != 'done'
      ) AS overdue

    FROM issues
    `
  );

  const row = result.rows[0];

  return {
    totalIssues:
      Number(row.total_issues),

    openIssues:
      Number(row.open_issues),

    inProgress:
      Number(row.in_progress),

    resolved:
      Number(row.resolved),

    critical:
      Number(row.critical),

    overdue:
      Number(row.overdue),
  };
}
module.exports = {
  createIssue,
  listIssues,
  getIssueById,
  updateIssue,
  assignIssueById,
  deleteIssue,
  listIssuesByProjectId,
  reorderIssues,
  getIssueKPIs,
};