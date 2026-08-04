const crypto = require("crypto");
const pool = require("../utils/db");
const { assertFound } = require("../utils/errors");
const { getUserSnapshot } = require("../utils/authUserSnapshot");
const {assertRequiredString,assertOneOf,assertMinLength,assertValidDate,validateIssueType,validateLabels,validateIssueDates,} = require("../utils/validators");
const { logActivity } = require("./activity.service");
const { HttpError, ERROR_CODES } = require("../utils/errors");
const { buildIssueQuery } = require("../utils/issueQueryBuilder");
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
async function ensureProjectExists(client, projectId) {
  const result = await client.query(
    "SELECT id FROM projects WHERE id = $1",
    [projectId]
  );

  assertFound(result.rows[0], "Project not found");
}
// ==========================================
// Ensure Assigned User belongs to Project
// ==========================================

async function ensureProjectMember(client,projectId,userId) {
  if (!userId) {
    return;
  }
  const result =
    await client.query(
      `
      SELECT id
      FROM project_members
      WHERE
      project_id = $1
      AND user_id = $2
      `,
      [
        projectId,
        userId,
      ]
    );
  assertFound(
    result.rows[0],
    "Assigned user is not a member of this project."
  );
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
// ==========================================
// Generate Issue Key
// ==========================================

async function generateIssueKey(projectId) {

  // Fetch Project Code

  const projectResult =
    await pool.query(

      `
      SELECT project_code
      FROM projects
      WHERE id = $1
      `,

      [projectId]

    );

  assertFound(

    projectResult.rows[0],

    "Project not found."

  );

  const projectCode =
    projectResult.rows[0].project_code;

  // Fetch Last Issue of this Project

  const issueResult =
    await pool.query(

      `
      SELECT issue_key
      FROM issues
      WHERE project_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,

      [projectId]

    );

  // First Issue

  if (issueResult.rows.length === 0) {

    return `${projectCode}-001`;

  }

  const lastIssueKey =
    issueResult.rows[0].issue_key;

  if (!lastIssueKey) {

    return `${projectCode}-001`;

  }

  const lastNumber =
    parseInt(

      lastIssueKey.split("-")[1],

      10

    );

  const nextNumber =
    lastNumber + 1;

  return `${projectCode}-${String(nextNumber).padStart(3, "0")}`;

}
// ✅ Create issue with transaction
async function createIssue(
  {
    title,
    projectId = null,
    parentIssueId = null,
    issueType = "Task",
    description = null,
    labels = [],
    priority,
    startDate,
    dueDate,
    assignedTo,
  },
  currentUser
) {
  
  const issueKey =
  await generateIssueKey(
    projectId
  );

  const client = await pool.connect();

  try {
    // ✅ START TRANSACTION
    await client.query("BEGIN");

    if (projectId) {
      projectId = projectId.trim();
      await ensureProjectExists(client, projectId);
      if (assignedTo) {
  await ensureProjectMember(
    client,
    projectId,
    assignedTo
  );
}
  await validateIssueHierarchy(
    client,
    projectId,
    issueType,
    parentIssueId
);

    }

    const now = new Date().toISOString();
    const userId = currentUser.id;

    const rank = projectId
      ? await getNextRankForProject(projectId)
      : null;

    // ✅ INSERT ISSUE
    const result = await client.query(
      `INSERT INTO issues
(id,issue_key,project_id,issue_type,title,description,status,priority,start_date,due_date,labels,rank,assigned_to,created_by,updated_by,created_at,updated_at,parent_issue_id)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
RETURNING *`,
      [
  crypto.randomUUID(),
  issueKey,
  projectId,
  validateIssueType(
    issueType
  ),
  validateTitle(
    title
  ),
  description,
  "backlog",
  validatePriority(
    priority
  ),
  startDate
    ? new Date(startDate).toISOString()
    : null,
  validateDueDate(
    dueDate
  ),
  validateLabels(
    labels
  ),
  rank,
  assignedTo
    ? validateAssignedTo(
        assignedTo
      )
    : null,
  userId,
  userId,
  now,
  now,
  parentIssueId
]
    );

    const issue = result.rows[0];

    // ✅ LOG ACTIVITY
    await logActivity({
      entityType: "issue",
      entityId: issue.id,
      action: "issue_created",
      message: `Issue "${issue.title}" created`,
      userId: currentUser.id,
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
  user,
  status,
  issueType,
  q,
  priority,
  assignedTo,
  sort = "createdAt",
  order = "desc",
  page = 1,
  limit = 10,
  view,
}) {

  const {
    query,
    values,
    countQuery,
    countValues,
  } = buildIssueQuery({

    status,

    issueType,

    priority,

    assignedTo,

    search: q,

    sort,

    order,

    page,

    limit,

    view,

  });

  const result =
    await pool.query(
      query,
      values
    );

  const countResult =
    await pool.query(
      countQuery,
      countValues
    );

  const total =
    Number(
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
// ✅ List all project issues
async function listProjectIssues(
  projectId,
  {
    status,
    issueType,
    q,
    priority,
    assignedTo,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
    view,
  }
) {
  const {
    query,
    values,
    countQuery,
    countValues,
  } = buildIssueQuery({
    projectId,
    status,
    issueType,
    priority,
    assignedTo,
    search: q,
    sort,
    order,
    page,
    limit,
    view,
  });

  const result = await pool.query(query, values);

  const countResult = await pool.query(
    countQuery,
    countValues
  );

  const total = Number(countResult.rows[0].total);

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
async function getIssueById(clientOrId, maybeId) {

  const client =
    maybeId ? clientOrId : pool;

  const id =
    maybeId ?? clientOrId;

  const result = await client.query(
    `
    SELECT *
    FROM issues
    WHERE id = $1
    `,
    [id]
  );
  const issue = result.rows[0];
  assertFound(issue, "Issue not found");
  return issue;
}
// ✅ Update issue
async function updateIssue(
  id,
  { title,issueType,parentIssueId,description,status,labels,priority,startDate,dueDate,assignedTo, },
  currentUser
) {
  const client = await pool.connect();
  try{
  const existing = await getIssueById(client,id);
  const effectiveIssueType =
  issueType !== undefined
    ? validateIssueType(issueType)
    : existing.issue_type;

const effectiveParentIssueId =
  parentIssueId !== undefined
    ? parentIssueId
    : existing.parent_issue_id;

  const oldStatus = existing.status;

  const nextStatus =
    status !== undefined
      ? (assertAllowedStatus(status), status)
      : existing.status;

  // ==========================================
// Validate Assignee belongs to Project
// ==========================================

if (assignedTo !== undefined &&assignedTo !== null)
   {
  await ensureProjectMember(client,existing.project_id,assignedTo);
   }
await validateIssueHierarchy(
  client,
  existing.project_id,
  effectiveIssueType,
  effectiveParentIssueId
);
  const updated = await client.query(
    `UPDATE issues SET

title = $1,
issue_type = $2,
description = $3,
status = $4,
priority = $5,
start_date = $6,
due_date = $7,
labels = $8,
assigned_to = $9,
parent_issue_id = $10,
updated_by = $11,
updated_at = $12
WHERE id = $13
RETURNING *`,
    [
    
  title !== undefined
    ? validateTitle(title)
    : existing.title,
  effectiveIssueType,
  description !== undefined
    ? description
    : existing.description,
  nextStatus,
  priority !== undefined
    ? validatePriority(priority)
    : existing.priority,

  startDate !== undefined ? startDate : existing.start_date,

  dueDate !== undefined ? validateDueDate(dueDate) : existing.due_date,

  labels !== undefined? validateLabels(labels): existing.labels,

  assignedTo !== undefined? assignedTo === null? null: validateAssignedTo( assignedTo)
    : existing.assigned_to,
  effectiveParentIssueId,

  currentUser.id,

  new Date().toISOString(),

  id,

    ]
  );

  const updatedIssue = updated.rows[0];

  const statusChanged = oldStatus !== updatedIssue.status;
  if (statusChanged) {

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
    userId: currentUser.id,
    message: statusChanged
      ? `Issue status changed from ${oldStatus} to ${updatedIssue.status}`
      : `Issue "${updatedIssue.title}" updated`,
  });
await client.query("COMMIT");
  return updatedIssue;
}
catch (error)
 {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
}}

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
    userId: currentUser.id,
  });

  return issue;
}

// ✅ Delete issue
async function deleteIssue(id, currentUser) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Ensure the issue exists
    const issue = await getIssueById(client, id);
    // Validate hierarchy
    await validateIssueDeletion(client, id);
    // Delete issue
    await client.query(
      `
      DELETE FROM issues
      WHERE id = $1
      `,
      [id]
    );
    // Log activity
    await logActivity({
      entityType: "issue",
      entityId: issue.id,
      action: "issue_deleted",
      userId: currentUser.id,
      message: `Issue "${issue.title}" deleted`,
    });
    await client.query("COMMIT");
    return issue;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
async function getIssueDetails(id) {
  const client = await pool.connect();
  try {
    // Get the issue
    const issue = await getIssueById(client, id);
    let parent = null;
    // Get parent if exists
    if (issue.parent_issue_id) {
      const parentResult = await client.query(
        `
        SELECT *
        FROM issues
        WHERE id = $1
        `,
        [issue.parent_issue_id]
      );
      parent = parentResult.rows[0] || null;
    }
    // Get children
    const childrenResult = await client.query(
      `
      SELECT *
      FROM issues
      WHERE parent_issue_id = $1
      ORDER BY created_at ASC
      `,
      [issue.id]
    );
    return {
      issue,
      parent,
      children: childrenResult.rows,
    };
  } finally {
    client.release();
  }
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
    userId: currentUser.id,
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
    userId: currentUser.id,
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
async function getMyDashboardStats(userId) {

  const result = await pool.query(
    `
    SELECT

      COUNT(*) AS assigned_to_me,

      COUNT(*) FILTER (
        WHERE status = 'done'
      ) AS completed_issues,

      COUNT(*) FILTER (
        WHERE status <> 'done'
      ) AS pending_issues,

      COUNT(*) FILTER (
        WHERE due_date < NOW()
        AND status <> 'done'
      ) AS overdue_issues

    FROM issues

    WHERE assigned_to = $1
    `,
    [userId]
  );

  return {
    assignedToMe: Number(
      result.rows[0].assigned_to_me
    ),

    completedIssues: Number(
      result.rows[0].completed_issues
    ),

    pendingIssues: Number(
      result.rows[0].pending_issues
    ),

    overdueIssues: Number(
      result.rows[0].overdue_issues
    ),
  };
}
async function getTaskDistribution(userId) {
  const result = await pool.query(
    `
    SELECT

      COUNT(*) AS total,

      COUNT(*) FILTER (
        WHERE status = 'backlog'
      ) AS backlog,

      COUNT(*) FILTER (
        WHERE status = 'todo'
      ) AS todo,

      COUNT(*) FILTER (
        WHERE status = 'in_progress'
      ) AS in_progress,

      COUNT(*) FILTER (
        WHERE status = 'done'
      ) AS done

    FROM issues

    WHERE assigned_to = $1
    `,
    [userId]
  );

  const row = result.rows[0];
  const total =Number(row.total);
  const backlog =Number(row.backlog);
  const todo =Number(row.todo);
  const inProgress =Number(row.in_progress);
  const done =Number(row.done);

  return {
    total,
    backlog: {
      count: backlog,
      percentage:
        total === 0
          ? 0
          : Math.round(
              (backlog / total) * 100
            ),
    },
    todo: {
      count: todo,
      percentage:
        total === 0
          ? 0
          : Math.round(
              (todo / total) * 100
            ),
    },
    inProgress: {
      count: inProgress,
      percentage:
        total === 0
          ? 0
          : Math.round(
              (inProgress / total) * 100
            ),
    },
    done: {
      count: done,
      percentage:
        total === 0
          ? 0
          : Math.round(
              (done / total) * 100
            ),
    },
  };
}
async function validateIssueHierarchy(
  client,
  projectId,
  issueType,
  parentIssueId
) {
  // Epics should never have a parent
  if (issueType === "Epic") {
    if (parentIssueId) {
      throw new HttpError(
  400,
  "An Epic cannot have a parent issue.",
  ERROR_CODES.VALIDATION_ERROR
);
    }
    return;
  }

  // All other issue types require a parent
  if (!parentIssueId) {
    throw new HttpError(
  400,
  `${issueType} must have a parent issue.`,
  ERROR_CODES.VALIDATION_ERROR
);
  }

  // Fetch parent issue
  const parentResult = await client.query(
    `
    SELECT id, issue_type, project_id
    FROM issues
    WHERE id = $1
    `,
    [parentIssueId]
  );

  if (parentResult.rowCount === 0) {
    throw new HttpError(
  404,
  "Parent issue not found.",
  ERROR_CODES.NOT_FOUND
);
  }

  const parent = parentResult.rows[0];

  // Parent must belong to the same project
  if (parent.project_id !== projectId) {
    throw new HttpError(
  400,
  "Parent issue must belong to the same project.",
  ERROR_CODES.VALIDATION_ERROR
);
  }

  // Allowed hierarchy
  const allowedParents = {
    Story: ["Epic"],
    Task: ["Story"],
    Bug: ["Story"],
    Improvement: ["Story"]
  };

  const validParents = allowedParents[issueType];

  if (!validParents.includes(parent.issue_type)) {
    throw new HttpError(
  400,
  `${issueType} cannot be created under ${parent.issue_type}.`,
  ERROR_CODES.VALIDATION_ERROR
);
  }
}
async function validateIssueDeletion(client, issueId) {
  const children = await client.query(
    `
    SELECT id, issue_key, title
    FROM issues
    WHERE parent_issue_id = $1
    LIMIT 1
    `,
    [issueId]
  );

  if (children.rows.length > 0) {
    throw new ApiError(
  400,
  `Cannot delete issue "${issue.title}" because it has child issues. Delete or reassign the child issues first.`
);  }
}
async function getIssueDetails(id) {
  const client = await pool.connect();

  try {
    // Get the issue
    const issue = await getIssueById(client, id);

    let parent = null;

    // Get parent if exists
    if (issue.parent_issue_id) {
      const parentResult = await client.query(
        `
        SELECT *
        FROM issues
        WHERE id = $1
        `,
        [issue.parent_issue_id]
      );

      parent = parentResult.rows[0] || null;
    }

    // Get child issues
    const childrenResult = await client.query(
      `
      SELECT *
      FROM issues
      WHERE parent_issue_id = $1
      ORDER BY created_at ASC
      `,
      [issue.id]
    );

    return {
      issue,
      parent,
      children: childrenResult.rows,
    };
  } finally {
    client.release();
  }
}
//Function to get all issues assigned to a specific user
async function getMyIssues(userId) {
  const client = await pool.connect();

  try {
    const {
      query,
      values,
    } = buildIssueQuery({
      assignedTo: userId,
      sort: "updatedAt",
      order: "desc",
      page: 1,
      limit: 1000,
    });

    const result = await client.query(
      query,
      values
    );

    return result.rows.map(issue => ({
      id: issue.id,
      issue_key: issue.issue_key,
      title: issue.title,
      issue_type: issue.issue_type,
      status: issue.status,
      priority: issue.priority,
      project_id: issue.project_id,
      project_name: issue.project_name,
      assigned_to: issue.assigned_to,
      start_date: issue.start_date,
      due_date: issue.due_date,
      created_at: issue.created_at,
      updated_at: issue.updated_at,

      parent: issue.parent_id
        ? {
            id: issue.parent_id,
            issue_key: issue.parent_issue_key,
            title: issue.parent_title,
          }
        : null,
    }));
  } finally {
    client.release();
  }
}
module.exports = {
  createIssue,
  listIssues,
  listProjectIssues,
  getIssueById,
  updateIssue,
  assignIssueById,
  deleteIssue,
  getIssueDetails,
  reorderIssues,
  getIssueKPIs,
  getMyDashboardStats,
  getTaskDistribution,
  getMyIssues,
  getIssueDetails,
};