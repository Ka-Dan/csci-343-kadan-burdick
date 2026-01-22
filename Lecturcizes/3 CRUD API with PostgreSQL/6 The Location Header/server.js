require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();
app.use(express.json());

app.post("/books", createBook);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function createBook(req, res) {
  const book = req.body;

  /**
   * We can have our query return the id of the new record inserted by adding "RETURNING id"
   */
  pgClient.query("INSERT INTO books (name, author) VALUES ($1, $2) RETURNING id", [book.name, book.author])
    .then((results) => {
      /**
       * Then we can inform the client that called the endpoint of the location of the new record
       * by setting the location header.
       *
       * Express has a convenience function for this: res.location().
       */
      res.location(`/books/${results.rows[0].id}`);
      res.status(201).json({ message: "Book created successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
    });
}