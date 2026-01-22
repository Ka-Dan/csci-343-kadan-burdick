require("dotenv").config();

const express = require("express");

/**
 * To use this, we need to install the pg package with npm.
 * To do this, run: npm install --save pg
 */
const { Pool } = require('pg');
const pgClient = new Pool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
});

const app = express();
app.get("/books", getBooks);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getBooks(req, res) {
  pgClient.query("SELECT name, author FROM books ORDER BY name")
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}