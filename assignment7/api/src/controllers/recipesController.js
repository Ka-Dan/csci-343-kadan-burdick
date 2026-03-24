const pgClient = require("../config/pgClient");

const index = (req, res) => {
  pgClient.query("SELECT id, name, description, author_id, category_id FROM recipes ORDER BY id")
  .then(results => {
    res.status(200).json(results.rows);
  })
  .catch((error) => {
    res.status(500).json({ error: `Error: ${error}.` });
  });
}

const show = (req, res) => {
  pgClient.query("SELECT id, name, description, author_id, category_id FROM recipes WHERE id = $1", [req.params.id])
    .then(results => {
      if(results.rowCount > 0)
        res.status(200).json(results.rows[0]);
      else
      res.status(404).json({ error: `Recipe not found for id ${req.params.id}.` });
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

const create = (req, res) => {
  const recipe = req.body;
  const sql = "INSERT INTO recipes (name, description) VALUES ($1, $2) RETURNING id";

  pgClient.query(sql, [recipe.name, recipe.description])
    .then(results => {
      res.location(`/recipes/${results.rows[0].id}`);
      res.status(201).json({ message: "Recipe created successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }.` });
    });
}

const update = (req, res) => {
  const recipe = req.body;
  const sql = "UPDATE recipes SET name = $1, description = $2 WHERE id = $3";

  pgClient.query(sql, [recipe.name, recipe.description, req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Recipe successfully updated." });
      }
      else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }` });
    });
}

const destroy = (req, res) => {
  pgClient.query("DELETE FROM recipes WHERE id = $1", [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Recipe successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error: ${ error }` });
    });
}

module.exports = { index, show, create, update, destroy };