// database.js

const { Pool } = require('pg');  // PostgreSQL module
const pool = new Pool({
  user: 'gab34',   // Replace with actual DB username
  host: 'dpg-cvdvlhlumphs73bm2big-a.oregon-postgres.render',       // Replace with actual DB host
  database: 'gab34',  // Replace with actual database name
  password: 'eZ9rNiP0asiNDccVx2FGtFCaRVlfmihK',  // Replace with actual DB password
  port: 5432,  // Replace with actual DB port (5432 is default for PostgreSQL)
});

module.exports = pool;
