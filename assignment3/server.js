require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();
app.use(express.json());

app.get("/recipes", getRecipes);
app.get("/recipes/:id", getRecipeById);
app.post("/recipes", createRecipe);
app.put("/recipes/:id", updateRecipe);
app.delete("/recipes/:id", deleteRecipe);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getRecipes(req, res) {
  pgClient.query("SELECT name, author FROM recipes ORDER BY id DESC")
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function getRecipeById(req, res) {
  pgClient.query("SELECT name, author, description, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5 FROM recipes WHERE id = $1", [req.params.id])
    .then((results) => {
      if(results.rowCount > 0) {
        res.status(200).json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function createRecipe(req, res) {
  const recipe = req.body;

  pgClient.query("INSERT INTO recipes (name, description, author, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
    [recipe.name, recipe.description, recipe.author, recipe.ingredient1, recipe.ingredient2, recipe.ingredient3, recipe.ingredient4, recipe.ingredient5])
    .then((results) => {
      res.location(`/recipes/${results.rows[0].id}`);
      res.status(201).json({ message: "Recipe created successfully." });
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
    });
}

function updateRecipe(req, res) {
  const recipe = req.body;

  pgClient.query("UPDATE recipes SET name = $1, description = $2, author = $3, ingredient1 = $4, ingredient2 = $5, ingredient3 = $6, ingredient4 = $7, ingredient5 = $8 WHERE id = $9",
    [recipe.name, recipe.description, recipe.author, recipe.ingredient1, recipe.ingredient2, recipe.ingredient3, recipe.ingredient4, recipe.ingredient5, req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Recipe updated successfully." });
      }
      else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error updating recipe: ${ error }` });
    });
}

function deleteRecipe(req, res) {
  pgClient.query("DELETE FROM recipes WHERE id = $1", [req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Recipe deleted successfully." });
      }
      else {
        res.status(404).json({ error: "Recipe not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error deleting recipe: ${ error }` });
    });
}