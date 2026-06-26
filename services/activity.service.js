const pool = require("../utils/db");

// ✅ CREATE ACTIVITY LOG
async function logActivity(
  {
    entityType,
    entityId,
    action,
    message,
    metadata,
  },
  client = pool
) {
  const result = await client.query(
    `
    INSERT INTO activity
    (
      entity_type,
      entity_id,
      action,
      message,
      metadata
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      entityType,
      entityId,
      action,
      message || null,
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
module.exports = {
  logActivity,
  listActivityByEntity,
  listRecentActivity,
};