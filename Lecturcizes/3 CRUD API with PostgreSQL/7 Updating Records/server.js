require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();
app.use(express.json());

app.put("/books/:id", updateBook);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function updateBook(req, res) {
  const book = req.body;

  pgClient.query("UPDATE books SET name = $1, author = $2 WHERE id = $3", [book.name, book.author, req.params.id])
    .then((results) => {
      /**
       * We can check how many records were updated using the results we get back from the query call.
       *
       * If it's 1 or greater than 0 (effectively the same thing in our case here) then we know that
       * the update was successfull.
       *
       * Otherwise, we could not find the record - which is not the same as an error updating a record
       * that we did find. So we provide different error messages to the user for record not found and
       * errors encountered during an update.
       */
      if (results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully updated." });
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: `Error updating book: ${ error }` });
    });
}