const pgClient = require("../config/pgClient");

const index = (req, res) => {
  pgClient.query("SELECT id, name FROM categories ORDER BY id")
  .then(results => {
    res.status(200).json(results.rows);
  })
  .catch((error) => {
    res.status(500).json({ error: `Error: ${error}.` });
  });
}

const show = (req, res) => {
  pgClient.query("SELECT id, name FROM categories WHERE id = $1", [req.params.id])
    .then(results => {
      if(results.rowCount > 0)
        res.status(200).json(results.rows[0]);
      else
      res.status(404).json({ error: `Category not found for id ${req.params.id}.` });
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

const create = (req, res) => {
  const category = req.body;
  const sql = "INSERT INTO categories (name) VALUES ($1) RETURNING id";

  pgClient.query(sql, [category.name])
    .then(results => {
      res.location(`/categories/${results.rows[0].id}`);
      res.status(201).json({ message: "Category created successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }.` });
    });
}

const update = (req, res) => {
  const category = req.body;
  const sql = "UPDATE categories SET name = $1 WHERE id = $2";

  pgClient.query(sql, [category.name, req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Category successfully updated." });
      }
      else {
        res.status(404).json({ error: "Category not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }` });
    });
}

const destroy = (req, res) => {
  pgClient.query("DELETE FROM categories WHERE id = $1", [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Category successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Category not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }` });
    });
}

module.exports = { index, show, create, update, destroy };