const pool = require("../utils/db");

// ✅ CREATE ACTIVITY LOG
async function logActivity(
{
    entityType,
    entityId,
    action,
    message,
    metadata,
    userId,
},
client = pool
)
 {
  const result = await client.query(
    `
    INSERT INTO activity
    (
      entity_type,
      entity_id,
      action,
      message,
      user_id,
      metadata
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [
      entityType,
      entityId,
      action,
      message || null,
      userId || null,
      metadata
        ? JSON.stringify(metadata)
        : null,
    ]
  );

  return result.rows[0];
}// ✅ LIST ACTIVITY BY ENTITY
async function listActivityByEntity(entityType, entityId) {
  const result = await pool.query(
    `SELECT * FROM activity
     WHERE entity_type = $1 AND entity_id = $2
     ORDER BY created_at DESC`,
    [entityType, entityId]
  );

  // map DB → old format
  return result.rows.map((row) => ({
    id: row.id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    message: row.message,
    createdAt: row.created_at,
  }));
}
// ✅ LIST ALL RECENT ACTIVITIES
async function listRecentActivity(
  limit = 10
) {
  const result =
    await pool.query(
      `
      SELECT *
      FROM activity
      ORDER BY created_at DESC
      LIMIT $1
      `,
      [limit]
    );

  return result.rows.map(
    (row) => ({
      id: row.id,
      entityType:
        row.entity_type,
      entityId:
        row.entity_id,
      action: row.action,
      message:
        row.message,
      createdAt:
        row.created_at,
    })
  );
}
async function getMyActivity(userId) {
  const result = await pool.query(
    `
    SELECT
        a.id,
        a.entity_type,
        a.entity_id,
        a.action,
        a.message,
        a.metadata,
        a.created_at,

        p.project_name,
        p.project_code,

        u.id AS performed_by,
        u.name AS performed_by_name,
        u.email AS performed_by_email

    FROM activity a

    INNER JOIN projects p
        ON a.entity_type = 'project'
       AND a.entity_id = p.id

    INNER JOIN project_members pm
        ON pm.project_id = p.id

    LEFT JOIN users u
        ON u.id = a.user_id

    WHERE pm.user_id = $1

    ORDER BY a.created_at DESC

    LIMIT 20
    `,
    [userId]
  );

  return result.rows;
}
module.exports = {
  logActivity,
  listActivityByEntity,
  listRecentActivity,
  getMyActivity,
};