require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();
app.use(express.json());

app.get("/recipes", getRecipes);
app.get("/recipes/:id", getRecipe);
app.post("/recipes", createRecipe);
app.put("/recipes/:id", updateRecipe);
app.delete("/recipes/:id", deleteRecipe);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getRecipes(req, res) {
  pgClient.query("SELECT id, name, description, author, category, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5 FROM recipes ORDER BY name")
    .then((results) => {
      res.status(200).json(results.rows);
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function getRecipe(req, res) {
  pgClient.query("SELECT name, description, author, category, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5 FROM recipes WHERE id = $1", [req.params.id])
    .then((results) => {
      if(results.rowCount > 0) {
        res.status(200).json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: "recipe not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

async function createRecipe(req, res) {
  const recipe = req.body;
  const errors = await validateRecipe(recipe);

  if (Object.keys(errors).length === 0) {
    pgClient.query("INSERT INTO recipes (name, description, author, category, ingredient1, ingredient2, ingredient3, ingredient4, ingredient5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [recipe.name, recipe.description, recipe.author, recipe.category, recipe.ingredient1, recipe.ingredient2, recipe.ingredient3, recipe.ingredient4, recipe.ingredient5])
      .then((results) => {
        res.location(`/recipes/${results.rows[0].id}`);
        res.status(201).json({ message: "recipe created successfully." });
      })
      .catch((error) => {
        res.status(500).json({ error: `We encountered an error with your request: ${ error }.` });
      });
  }
  else {
    res.status(400).json({ errors });
  }
}

async function updateRecipe(req, res) {
  const recipe = req.body;
  const errors = await validateRecipe(recipe, req.params.id);

  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors });
  }
  else {
    pgClient.query("UPDATE recipes SET name = $1, author = $2, description = $3, category = $4, ingredient1 = $5, ingredient2 = $6, ingredient3 = $7, ingredient4 = $8, ingredient5 = $9 WHERE id = $10",
      [recipe.name, recipe.author, recipe.description, recipe.category, recipe.ingredient1, recipe.ingredient2, recipe.ingredient3, recipe.ingredient4, recipe.ingredient5, req.params.id])
      .then((results) => {
        if (results.rowCount > 0) {
          res.status(200).json({ message: "recipe successfully updated." });
        }
        else {
          res.status(404).json({ error: "recipe not found." });
        }
      })
      .catch((error) => {
        res.status(500).json({ error: `Error updating recipe: ${error}` });
      });
  }
}

function deleteRecipe(req, res) {
  pgClient.query("DELETE FROM recipes WHERE id = $1", [req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "recipe successfully deleted." });
      }
      else {
        res.status(404).json({ error: "recipe not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error deleting recipe: ${ error }` });
    });
}

async function validateRecipe(recipe, recipeId = null) {
  const errors = {};

  if (!!!recipe.name) {
    errors.name = "is required.";
  }

  if (recipe.name.length > 100) {
    errors.name = "must be less than or equal to 100 characters.";
  }

  if (!!!recipe.description) {
    errors.description = "is required";
  }

  if (recipe.description.length > 255) {
    errors.description = "must be less than or equal to 255 characters"
  }

  if (!!!recipe.author) {
    errors.author = "is required.";
  }

  if (recipe.author.length > 60) {
    errors.author = "must be less than or equal to 60 characters.";
  }

  if (!!!recipe.category) {
    errors.category = "is required";
  }

  if (recipe.category.length > 50) {
    errors.category = "must be less than or equal to 50 characters";
  }

  if (!!!recipe.ingredient1) {
    errors.ingredient1 = "is required";
  }

  if (recipe.ingredient1.length > 50) {
    errors.ingredient1 = "must be less than or equal to 50 characters";
  }

  if (recipe.ingredient2.length > 50) {
    errors.ingredient2 = "must be less than or equal to 50 characters";
  }

  if (recipe.ingredient3.length > 50) {
    errors.ingredient3 = "must be less than or equal to 50 characters";
  }

  if (recipe.ingredient4.length > 50) {
    errors.ingredient4 = "must be less than or equal to 50 characters";
  }

  if (recipe.ingredient5.length > 50) {
    errors.ingredient5 = "must be less than or equal to 50 characters";
  }

  let query;
  if (!!recipeId) {
    query = pgClient.query("SELECT id FROM recipes WHERE name = $1 AND id != $2", [recipe.name, recipeId]);
  }
  else {
    query = pgClient.query("SELECT id FROM recipes WHERE name = $1", [recipe.name]);
  }

  const recipeExists = (await query).rowCount > 0;
  if (recipeExists) {
    errors.name = "already taken.";
  }

  return errors;
}