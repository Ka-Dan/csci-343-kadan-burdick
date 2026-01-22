const pgClient = require("../config/pgClient");

const index = (req, res) => {
  pgClient.query("SELECT id, title, first_name, middle_name, last_name FROM authors ORDER BY id")
  .then(results => {
    res.status(200).json(results.rows);
  })
  .catch((error) => {
    res.status(500).json({ error: `Error: ${error}.` });
  });
}

const show = (req, res) => {
  pgClient.query("SELECT id, title, first_name, middle_name, last_name FROM authors WHERE id = $1", [req.params.id])
    .then(results => {
      if(results.rowCount > 0)
        res.status(200).json(results.rows[0]);
      else
      res.status(404).json({ error: `Author not found for id ${req.params.id}.` });
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

const create = (req, res) => {
  const author = req.body;
  const sql = "INSERT INTO authors (title, first_name, middle_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id";

  pgClient.query(sql, [author.title, author.first_name, author.middle_name, author.last_name])
    .then(results => {
      res.location(`/authors/${results.rows[0].id}`);
      res.status(201).json({ message: 'Author created successfully.' });
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }.` });
    });
}

const update = (req, res) => {
  const author = req.body;
  const sql = "UPDATE authors SET title = $1, first_name = $2, middle_name = $3, last_name = $4 WHERE id = $5";

  pgClient.query(sql, [author.title, author.first_name, author.middle_name, author.last_name, req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Author successfully updated." });
      }
      else {
        res.status(404).json({ error: "Author not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }` });
    });
}

const destroy = (req, res) => {
  pgClient.query("DELETE FROM authors WHERE id = $1", [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Author successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Author not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }` });
    });
}

module.exports = { index, show, create, update, destroy };