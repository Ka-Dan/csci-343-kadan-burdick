require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();

app.delete("/books/:id", deleteBook);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function deleteBook(req, res) {
  pgClient.query("DELETE FROM books WHERE id = $1", [req.params.id])
    .then((results) => {
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error deleting book: ${ error }` });
    });
}