const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "forgeflow",
  password: "Tarunima@2004",
  port: 5432,
});

// 🔥 Test DB connection + print EXACT DB being used
pool.connect()
  .then(client => {
    return client
      .query("SELECT current_database(), inet_server_port()")
      .then(res => {
        console.log("✅ DB CONNECTED:", res.rows[0]);
        client.release();
      })
      .catch(err => {
        client.release();
        console.error("❌ DB QUERY ERROR:", err.message);
      });
  })
  .catch(err => {
    console.error("❌ DB CONNECTION ERROR:", err.message);
  });

module.exports = pool;