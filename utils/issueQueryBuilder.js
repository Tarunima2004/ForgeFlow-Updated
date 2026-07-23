function buildBaseQuery() {
  return `
    SELECT
      i.*,
      p.project_name,

      parent.id AS parent_id,
      parent.issue_key AS parent_issue_key,
      parent.title AS parent_title
    FROM issues i
  `;
}

function buildJoins() {
  return `
    INNER JOIN projects p
      ON p.id = i.project_id

    LEFT JOIN issues parent
      ON parent.id = i.parent_issue_id
  `;
}
function buildConditions(options = {}) {
  const {
    projectId,
    assignedTo,
    status,
    priority,
    issueType,
    search,
  } = options;

  const values = [];
  const conditions = [];

  // Project filter
  if (projectId) {
    values.push(projectId);
    conditions.push(`i.project_id = $${values.length}`);
  }

  // Assigned user filter
  if (assignedTo) {
    values.push(assignedTo);
    conditions.push(`i.assigned_to = $${values.length}`);
  }

  // Status filter
  if (status) {
    values.push(status);
    conditions.push(`i.status = $${values.length}`);
  }

  // Priority filter
  if (priority) {
    values.push(priority);
    conditions.push(`i.priority = $${values.length}`);
  }

  // Issue type filter
  if (issueType) {
    values.push(issueType);
    conditions.push(`i.issue_type = $${values.length}`);
  }

  // Search filter
  if (search && search.trim()) {
    values.push(`%${search.trim()}%`);

    conditions.push(`
      (
        i.title ILIKE $${values.length}
        OR i.description ILIKE $${values.length}
      )
    `);
  }

  return {
    whereClause:
      conditions.length > 0
        ? `WHERE ${conditions.join(" AND ")}`
        : "",

    values,
  };
}
function buildOrderBy(options = {}) {
  const {
    view,
    sort = "createdAt",
    order = "desc",
  } = options;

  // Allowed sort columns
  const sortMap = {
    createdAt: "i.created_at",
    updatedAt: "i.updated_at",
    priority: "i.priority",
    dueDate: "i.due_date",
    title: "i.title",
  };

  // Kanban Board View
  if (view === "board") {
    return `
      ORDER BY
        i.status ASC,
        i.rank ASC NULLS LAST
    `;
  }

  // List View
  const sortColumn =
    sortMap[sort] || "i.created_at";

  const sortOrder =
    order.toLowerCase() === "asc"
      ? "ASC"
      : "DESC";

  return `
    ORDER BY
      ${sortColumn}
      ${sortOrder}
  `;
}
function buildPagination(
  page = 1,
  limit = 10,
  values = []
) {
  const currentPage =
  Math.max(1, Number(page) || 1);

const pageSize =
  Math.min(
    100,
    Math.max(1, Number(limit) || 10)
  );

  const offset =
    (currentPage - 1) * pageSize;

  values.push(pageSize);

  const limitIndex =
    values.length;

  values.push(offset);

  const offsetIndex =
    values.length;

  return {
    paginationClause: `
      LIMIT $${limitIndex}
      OFFSET $${offsetIndex}
    `,
    values,
  };
}
function buildIssueQuery(options = {}) {
  const {
    page = 1,
    limit = 10,
  } = options;

  // Base SELECT ... FROM ...
  const baseQuery = buildBaseQuery();

  // WHERE clause + parameter values
  const {
    whereClause,
    values,
  } = buildConditions(options);

  // ORDER BY clause
  const orderByClause =
    buildOrderBy(options);

  // LIMIT & OFFSET
  const {
    paginationClause,
    values: finalValues,
  } = buildPagination(
    page,
    limit,
    [...values] // create a copy so countValues remain unchanged
  );
const joins = buildJoins();

  // Main query
  const query = `
  ${baseQuery}
  ${joins}
  ${whereClause}
  ${orderByClause}
  ${paginationClause}
`;

  // Count query
  const countQuery = buildCountQuery(
    whereClause
  );

  return {
    query,
    values: finalValues,
    countQuery,
    countValues: values,
  };
}
function buildCountQuery(whereClause = "") {
  return `
    SELECT COUNT(*) AS total

    FROM issues i

    INNER JOIN projects p
      ON p.id = i.project_id

    LEFT JOIN issues parent
      ON parent.id = i.parent_issue_id

    ${whereClause}
  `;
}

module.exports = {
  buildIssueQuery,
};