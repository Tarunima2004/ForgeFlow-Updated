const db = require("./utils/db");

console.log("DB IMPORT:", db);
console.log("TYPE:", typeof db);

async function test() {
  try {
    console.log("QUERY FUNCTION:", db.query);
    const res = await db.query("SELECT NOW()");
    console.log("SUCCESS:", res.rows);
  } catch (err) {
    console.error("DB Error:", err);
  }
}

test();