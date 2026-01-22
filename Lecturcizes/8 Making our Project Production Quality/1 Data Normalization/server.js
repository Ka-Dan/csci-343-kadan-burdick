require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * After our normalization, we have two resources: authors and books.
 */
app.get("/authors", getAuthors);
app.get("/authors/:id", getAuthor);
app.post("/authors", createAuthor);
app.put("/authors/:id", updateAuthor);
app.delete("/authors/:id", deleteAuthor);

app.get("/books", getBooks);
app.get("/books/:id", getBook);
app.post("/books", createBook);
app.put("/books/:id", updateBook);
app.delete("/books/:id", deleteBook);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getAuthors(req, res) {
  pgClient.query("SELECT id, title, first_name, middle_name, last_name FROM authors ORDER BY id")
  .then((results) => {
    res.status(200).json(results.rows);
  })
  .catch((error) => {
    res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
  });
}

function getAuthor(req, res) {
  pgClient.query("SELECT id, title, first_name, middle_name, last_name FROM authors WHERE id = $1", [req.params.id])
    .then((results) => {
      if(results.rowCount > 0) {
        res.status(200).json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: "Author not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function createAuthor(req, res) {
  const author = req.body;
  const sql = "INSERT INTO authors (title, first_name, middle_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id";

  pgClient.query(sql, [author.title, author.first_name, author.middle_name, author.last_name])
    .then((results) => {
      res.location(`/authors/${results.rows[0].id}`);
      res.status(201).json({ message: "Author created successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
    });
}

function updateAuthor(req, res) {
  const author = req.body;
  const sql = "UPDATE authors SET title = $1, first_name = $2, middle_name = $3, last_name = $4 WHERE id = $5";

  pgClient.query(sql, [author.title, author.first_name, author.middle_name, author.last_name, req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Author successfully updated." });
      }
      else {
        res.status(404).json({ error: "Author not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error updating author: ${ error }` });
    });
}

function deleteAuthor(req, res) {
  pgClient.query("DELETE FROM authors WHERE id = $1", [req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Author successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Author not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error deleting author: ${ error }` });
    });
}

async function getBooks(req, res) {
  /**
   * It is convention to return the author as a child object of the book in
   * our JSON. To do this, we need both our book and author data.
   */
  try {
    const sql = "SELECT id, title, author_id FROM books ORDER BY id";

    const books = [];
    const results = await pgClient.query(sql);

    for(const result of results.rows) {
      const author = await pgClient.query("SELECT id, title, first_name, middle_name, last_name FROM authors WHERE id = $1", [result.author_id]);
      const book = {id: result.id, title: result.title, author: author.rows[0]}

      books.push(book);
    }

    res.status(200).json(books);
  }
  catch(error) {
    res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
  }
}

async function getBook(req, res) {
  try {
    const sql = "SELECT id, title, author_id FROM books WHERE id = $1";
    const results = await pgClient.query(sql, [req.params.id]);

    if(results.rowCount > 0) {
      const author = await pgClient.query("SELECT id, title, first_name, middle_name, last_name FROM authors WHERE id = $1", [results.rows[0].author_id]);
      const book = { id: results.rows[0].id, title: results.rows[0].title, author: author.rows[0]};

      res.status(200).json(book);
    }
    else {
      res.status(404).json({ error: "Book not found." });
    }
  }
  catch(error) {
    res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
  }
}

function createBook(req, res) {
  const book = req.body;

  pgClient.query("INSERT INTO books (title, author_id) VALUES ($1, $2) RETURNING id", [book.title, book.author_id])
    .then((results) => {
      res.location(`/books/${results.rows[0].id}`);
      res.status(201).json({ message: "Book created successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
    });
}

function updateBook(req, res) {
  const book = req.body;

  pgClient.query("UPDATE books SET title = $1, author_id = $2 WHERE id = $3", [book.title, book.author_id, req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully updated." });
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error updating book: ${ error }` });
    });
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