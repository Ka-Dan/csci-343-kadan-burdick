const pgClient = require("../config/pgClient");

const validateRecipe = async (req, res, next) => {
  const recipe = req.body;
  recipe.id = req.params.id;
  const errors = {};

  // Name validation
  if (!recipe.name || recipe.name.length === 0) {
    errors.name = "Name is required.";
  }

  if (recipe.name && recipe.name.length > 100) {
    errors.name = "Name must be less than 100 characters.";
  }

  // Description validation
  if (!recipe.description && recipe.description.length === 0) {
    errors.description = "Description is required";
  }

  if (recipe.description && recipe.description.length > 255) {
    errors.description = "Description must be less than 255 characters";
  }

  // Ingredient id validation
  if (!recipe.ingredient_ids || !Array.isArray(recipe.ingredient_ids) || recipe.ingredient_ids.length === 0) {
    errors.ingredient_ids = "At least one ingredient is required.";
  }

  let query;
  if (recipe.id) {
    query = pgClient.query("SELECT id FROM recipes WHERE name = $1 AND id != $2", [recipe.name, recipe.id]);
  }
  else {
    query = pgClient.query("SELECT id FROM recipes WHERE name = $1", [recipe.name]);
  }

  // Pre-exisiting validation
  const recipeExists = (await query).rowCount > 0;
  if (recipeExists) {
    errors.name = "Already taken.";
  }

  // Foreign key validation
  if (!recipe.author_id || recipe.author_id.length === 0) {
    errors.author_id = "Author is required.";
  }

  if (!recipe.category_id || recipe.category_id.length === 0) {
    errors.category_id = "Category is required."
  }

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
  }
  else {
    next();
  }
}

const validateCategory = async (req, res, next) => {
  const category = req.body;
  const errors = {};

  if (!category.name || category.name.length === 0) {
    errors.category = "Category is required";
  }

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
  }
  else {
    next();
  }
}

module.exports = {
  validateRecipe,
  validateCategory,
};