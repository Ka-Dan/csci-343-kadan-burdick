require("dotenv").config();

const express = require("express");

const app = express();
app.use(express.json());

const authorRoutes = require("./routes/authorRoutes");
app.use("/authors", authorRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/categories", categoryRoutes);

const ingredientRoutes = require("./routes/ingredientRoutes");
app.use("/ingredients", ingredientRoutes);

const recipeRoutes = require("./routes/recipeRoutes");
app.use("/recipes", recipeRoutes);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});