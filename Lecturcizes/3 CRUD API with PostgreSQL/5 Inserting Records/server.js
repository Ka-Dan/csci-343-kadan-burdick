require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();

/**
 * This is a library to parse the body of requests.
 *
 * If you recall from Advanced Web Dev, post and put requests use the body for
 * the data instead of the query.
 */
app.use(express.json());

app.post("/books", createBook);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function createBook(req, res) {
  const book = req.body;

  pgClient.query("INSERT INTO books (name, author) VALUES ($1, $2)", [book.name, book.author])
    .then((results) => {
      res.status(201).json({ message: "Book created successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
    });
}