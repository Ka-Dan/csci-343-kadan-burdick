require("dotenv").config();

const express = require("express");
const pgClient = require("./config/pgClient");

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authorRoutes = require("./routes/authorRoutes");
app.use("/authors", authorRoutes);

const bookRoutes = require("./routes/bookRoutes");
app.use("/books", bookRoutes);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});