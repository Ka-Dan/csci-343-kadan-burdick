const pgClient = require("../config/pgClient");

const index = (req, res) => {
  const sql = `
    SELECT
      r.id,
      r.name,
      r.description,
      a.name AS author_name,
      c.name AS category_name,
      json_agg(json_build_object('id', i.id, 'name', i.name)) AS ingredients
    FROM recipes r
    LEFT JOIN authors a ON r.author_id = a.id
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    LEFT JOIN ingredients i ON ri.ingredient_id = i.id
    GROUP BY r.id, a.name, c.name
    ORDER BY r.id ASC
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
      r.id,
      r.name,
      r.description,
      r.author_id,
      r.category_id,
      json_agg(
        json_build_object('id', i.id, 'name', i.name)
      ) AS ingredients
    FROM recipes r
    LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
    LEFT JOIN ingredients i ON ri.ingredient_id = i.id
    WHERE r.id = $1
    GROUP BY r.id, r.name, r.description, r.author_id, r.category_id
  `
  pgClient.query(sql, [req.params.id])
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

const create = async (req, res) => {
  const { name, description, author_id, category_id, ingredient_ids } = req.body;

  try {
    await pgClient.query('BEGIN');

    const recipeSql = "INSERT INTO recipes (name, description, author_id, category_id) VALUES ($1, $2, $3, $4) RETURNING id";
    const recipeRes = await pgClient.query(recipeSql, [name, description, author_id, category_id]);
    const newRecipeId = recipeRes.rows[0].id;

    if (ingredient_ids && ingredient_ids.length > 0) {
      const values = ingredient_ids.map(ingId => `(${newRecipeId}, ${ingId})`).join(',');
      await pgClient.query(`INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ${values}`);
    }

    await pgClient.query('COMMIT');
    res.status(201).json({ message: "Recipe created successfully.", id: newRecipeId });
  } catch (error) {
    await pgClient.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
}

const update = async (req, res) => {
  const { name, description, author_id, category_id, ingredient_ids } = req.body;
  const recipeId = req.params.id;

  try {
    await pgClient.query('BEGIN');

    const updateSql = "UPDATE recipes SET name = $1, description = $2, author_id = $3, category_id = $4 WHERE id = $5";
    await pgClient.query(updateSql, [name, description, author_id, category_id, recipeId]);

    await pgClient.query("DELETE FROM recipe_ingredients WHERE recipe_id = $1", [recipeId]);

    if (ingredient_ids && ingredient_ids.length > 0) {
      const values = ingredient_ids.map(ingId => `(${recipeId}, ${ingId})`).join(',');
      await pgClient.query(`INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES ${values}`);
    }

    await pgClient.query('COMMIT');
    res.status(200).json({ message: "Recipe updated successfully." });
  } catch (error) {
    await pgClient.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
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