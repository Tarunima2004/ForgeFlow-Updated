const fs = require("fs");
const path = require("path");

function seedData() {
  const dbPath = path.join(__dirname, "../data/db.json");
  const seedPath = path.join(__dirname, "../data/seed.json");

  // If DB already has data → skip
  if (fs.existsSync(dbPath)) {
    const existing = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    if (existing.users && existing.users.length > 0) {
      console.log("Seed skipped: data already exists");
      return;
    }
  }

  // Load seed data
  const seed = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

  // Write into DB
  fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2));

  console.log("Seed data loaded successfully");
}

module.exports = { seedData };