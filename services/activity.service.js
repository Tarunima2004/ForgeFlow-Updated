const crypto = require("crypto");
const { readActivity, writeActivity } = require("../utils/fileDb");

async function logActivity({ entityType, entityId, action, message }) {
  const activity = await readActivity();

  const entry = {
    id: crypto.randomUUID(),
    entityType,
    entityId,
    action,
    message,
    createdAt: new Date().toISOString(),
  };

  activity.push(entry);
  await writeActivity(activity);

  return entry;
}

async function listActivityByEntity(entityType, entityId) {
  const activity = await readActivity();

  return activity.filter(
    (entry) => entry.entityType === entityType && entry.entityId === entityId
  );
}

module.exports = {
  logActivity,
  listActivityByEntity,
};