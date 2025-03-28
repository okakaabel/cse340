// database.js

const { Pool } = require('pg');  // PostgreSQL module
const pool = new Pool({
  user: 'your-username',   // Replace with actual DB username
  host: 'localhost',       // Replace with actual DB host
  database: 'your-database',  // Replace with actual database name
  password: 'your-password',  // Replace with actual DB password
  port: 5432,  // Replace with actual DB port (5432 is default for PostgreSQL)
});

module.exports = pool;
