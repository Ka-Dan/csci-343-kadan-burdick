require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();

app.get("/books", getBooks);

/**
 * We represent RESTful params (params within the URI itself) using a colon then the name of
 * the param.
 *
 * In this case we are using :id
 */
app.get("/books/:id", getBook);

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

function getBook(req, res) {
  /**
   * Two things to note here:
   * 1) How to access RESTful params from the req object. We access them through req.params (similarly
   * to how we access values from the query with req.query).
   *
   * 2) We do not use String concatenation or template literals when building our SQL. This is because
   * of security concerns. Concatenation would open us up to SQL injection attacks.
   *
   * Instead, we use what are called placeholders. The first would be $1 and then $2 and so on. We also
   * pass the values we want to replace the placeholders with as an array. When the library replaces
   * the placeholders it sanitizes them to protect us against attacks.
   */
  pgClient.query("SELECT name, author FROM books WHERE id = $1", [req.params.id])
    .then((results) => {
      res.status(200).json(results.rows[0]);
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}