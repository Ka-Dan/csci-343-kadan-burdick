const pgClient = require("../config/pgClient");

const validateBook = async (req, res, next) => {
  const book = req.body;
  book.id = req.params.id;
  const errors = {};

  if (!book.title || book.title.length === 0) {
    errors.title = "Title is required.";
  }

  if (book.title && book.title.length > 100) {
    errors.title = "Title must be less than 50 characters.";
  }

  let query;
  if (book.id) {
    query = pgClient.query("SELECT id FROM books WHERE title = $1 AND id != $2", [book.title, bookId]);
  }
  else {
    query = pgClient.query("SELECT id FROM books WHERE title = $1", [book.title]);
  }

  const bookExists = (await query).rowCount > 0;
  if (bookExists) {
    errors.title = "already taken.";
  }

  if (!book.author_id || book.author_id.length === 0) {
    errors.author_id = "Author is required.";
  }

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
  }
  else {
    next();
  }
}

const validateAuthor = async (req, res, next) => {
  const author = req.body;
  const errors = {};

  if (author.title && author.title.length > 10) {
    errors.title = "cannot be more than 50 characters.";
  }

  if (author.first_name && author.first_name.length > 50) {
    errors.first_name = "cannot be more than 50 characters.";
  }

  if (author.middle_name && author.middle_name.length > 50) {
    errors.middle_name = "cannot be more than 50 characters.";
  }

  if (!author.last_name || author.last_name.length === 0) {
    errors.last_name = "is required.";
  }

  if (author.last_name && author.last_name.length > 50) {
    errors.last_name = "cannot be more than 50 characters.";
  }

  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
  }
  else {
    next();
  }
}

module.exports = {
  validateBook,
  validateAuthor
};