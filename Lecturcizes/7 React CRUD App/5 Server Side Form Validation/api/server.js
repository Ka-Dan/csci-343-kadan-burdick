require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();
app.use(express.json());

app.get("/books", getBooks);
app.get("/books/:id", getBook);
app.post("/books", createBook);
app.put("/books/:id", updateBook);
app.delete("/books/:id", deleteBook);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getBooks(req, res) {
  pgClient.query("SELECT id, name, author FROM books ORDER BY name")
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function getBook(req, res) {
  pgClient.query("SELECT name, author FROM books WHERE id = $1", [req.params.id])
    .then((results) => {
      if(results.rowCount > 0) {
        res.status(200).json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

async function createBook(req, res) {
  const book = req.body;
  const errors = await validateBook(book);

  if (Object.keys(errors).length === 0) {
    pgClient.query("INSERT INTO books (name, author) VALUES ($1, $2) RETURNING id", [book.name, book.author])
      .then((results) => {
        res.location(`/books/${results.rows[0].id}`);
        res.status(201).json({ message: "Book created successfully." });
      })
      .catch((error) => {
        res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
      });
  }
  else {
    res.status(400).json({ errors });
  }
}

async function updateBook(req, res) {
  const book = req.body;
  const errors = await validateBook(book, req.params.id);

  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors });
  }
  else {
    pgClient.query("UPDATE books SET name = $1, author = $2 WHERE id = $3", [book.name, book.author, req.params.id])
      .then((results) => {
        if (results.rowCount > 0) {
          res.status(200).json({ message: "Book successfully updated." });
        }
        else {
          res.status(404).json({ error: "Book not found." });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: `Error updating book: ${error}` });
      });
  }
}

function deleteBook(req, res) {
  pgClient.query("DELETE FROM books WHERE id = $1", [req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error deleting book: ${ error }` });
    });
}

async function validateBook(book, bookId = null) {
  const errors = {};

  if (!!!book.name) {
    errors.name = "is required.";
  }

  if (book.name.length > 50) {
    errors.name = "must be less than 50 characters.";
  }

  if (!!!book.author) {
    errors.author = "is required.";
  }

  if (book.author.length > 50) {
    errors.author = "must be less than 50 characters.";
  }

  let query;
  if (!!bookId) {
    query = pgClient.query("SELECT id FROM books WHERE name = $1 AND id != $2", [book.name, bookId]);
  }
  else {
    query = pgClient.query("SELECT id FROM books WHERE name = $1", [book.name]);
  }

  const bookExists = (await query).rowCount > 0;
  if (bookExists) {
    errors.name = "already taken.";
  }

  return errors;
}