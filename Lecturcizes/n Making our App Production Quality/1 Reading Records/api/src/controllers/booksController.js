const pgClient = require("../config/pgClient");

const index = (req, res) => {
  const sql = `
    SELECT
      b.id,
      b.title,
      json_build_object(
        'id', a.id,
        'title', a.title,
        'first_name', a.first_name,
        'middle_name', a.middle_name,
        'last_name', a.last_name
      ) AS author
    FROM
      books b
      INNER JOIN authors a ON a.id = b.author_id
    ORDER BY
      b.id
  `;

  pgClient.query(sql)
    .then(results => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

const show = (req, res) => {
  const sql = `
    SELECT
      b.id,
      b.title,
      json_build_object('id', a.id, 'title', a.title, 'first_name', a.first_name, 'middle_name', a.middle_name, 'last_name', a.last_name)
    FROM
      books b
      INNER JOIN authors a ON a.id = b.author_id
    WHERE
      b.id = $1
  `;

  pgClient.query(sql, [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: `Book not found for id ${req.params.id}.` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

const create = (req, res) => {
  const book = req.body;

  pgClient.query("INSERT INTO books (title, author_id) VALUES ($1, $2) RETURNING id", [book.title, book.author_id])
    .then(results => {
      res.location(`/books/${results.rows[0].id}`);
      res.status(201).json({ message: 'Book created successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }.` });
    });
}

const update = (req, res) => {
  const book = req.body;

  pgClient.query("UPDATE books SET title = $1, author_id = $2 WHERE id = $3", [book.title, book.author_id, req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully updated." });
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }` });
    });
}

const destroy = (req, res) => {
  pgClient.query("DELETE FROM books WHERE id = $1", [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }` });
    });
}

module.exports = { index, show, create, update, destroy };