require("dotenv").config();

const { Pool } = require('pg');
const pgClient = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

module.exports = pgClient;