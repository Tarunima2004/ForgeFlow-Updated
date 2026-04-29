const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

const ISSUES_FILE = path.join(DATA_DIR, "issues.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");
const ACTIVITY_FILE = path.join(DATA_DIR, "activity.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

/**
 * Ensure directory + file exists
 */
async function ensureFile(file, defaultData = "[]") {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, defaultData, "utf-8");
  }
}

/**
 * Read JSON safely from file
 */
async function readJsonFile(file) {
  await ensureFile(file);

  try {
    const raw = await fs.readFile(file, "utf-8");

    // Handle empty file case
    if (!raw || !raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`❌ Error reading file ${file}:`, err.message);

    // Reset corrupted file
    await fs.writeFile(file, "[]", "utf-8");

    return [];
  }
}

/**
 * Write JSON safely to file
 */
async function writeJsonFile(file, data) {
  await ensureFile(file);

  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`❌ Error writing file ${file}:`, err.message);
    throw err;
  }
}

/* ===========================
   Issues
=========================== */

async function readIssues() {
  return readJsonFile(ISSUES_FILE);
}

async function writeIssues(data) {
  return writeJsonFile(ISSUES_FILE, data);
}

/* ===========================
   Projects
=========================== */

async function readProjects() {
  return readJsonFile(PROJECTS_FILE);
}

async function writeProjects(data) {
  return writeJsonFile(PROJECTS_FILE, data);
}

/* ===========================
   Comments
=========================== */

async function readComments() {
  return readJsonFile(COMMENTS_FILE);
}

async function writeComments(data) {
  return writeJsonFile(COMMENTS_FILE, data);
}

/* ===========================
   Activity Logs
=========================== */

async function readActivity() {
  return readJsonFile(ACTIVITY_FILE);
}

async function writeActivity(data) {
  return writeJsonFile(ACTIVITY_FILE, data);
}

/* ===========================
   Users
=========================== */

async function readUsers() {
  return readJsonFile(USERS_FILE);
}

async function writeUsers(data) {
  return writeJsonFile(USERS_FILE, data);
}

module.exports = {
  readIssues,
  writeIssues,
  readProjects,
  writeProjects,
  readComments,
  writeComments,
  readActivity,
  writeActivity,
  readUsers,
  writeUsers,
};