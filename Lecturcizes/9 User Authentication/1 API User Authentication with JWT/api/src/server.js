require("dotenv").config();

const express = require("express");

const app = express();
app.use(express.json());

/*
* cookie-parser is a middleware that parses cookies attached to the client request object.
* It makes the cookies available in the request object as req.cookies.
*
* We will use it to parse the jwt cookie that we set in the response object of register and login.
*/
const cookies = require("cookie-parser");
app.use(cookies());

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const authorRoutes = require("./routes/authorRoutes");
app.use("/authors", authorRoutes);

const bookRoutes = require("./routes/bookRoutes");
app.use("/books", bookRoutes);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});