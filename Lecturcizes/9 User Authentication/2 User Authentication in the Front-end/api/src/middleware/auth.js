const jwt = require('jsonwebtoken');
const pgClient = require('../config/pgClient');

function authenticate(req, res, next) {
  /*
  * Here we are checking for the token in the cookies or in the headers.
  * The token will be in the cookies if the user is using a browser.
  * It will be in the headers if the user is using a REST client like Postman.
  */
  const token = req.cookies?.jwt || req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  /*
  * jwt.verify() will decode the token and return the payload.
  * If the token is invalid, it will return an error. When that happens,
  * we return a 401 status code.
  *
  * We use a 401 status code because the user is not authenticated.
  * A 403 status code would be used if the user is authenticated but not authorized.
  */
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: `Bad token. ${error}` });
    }
    else {
      pgClient.query('SELECT id, email, is_admin FROM users WHERE id = $1', [decoded.id])
        .then(results => {
          if (results.rowCount > 0) {
            /*
            * res.locals is an object that is available to all middleware functions.
            * We can use it to store data that we want to pass to the next middleware function.
            *
            * In this case, we are storing the user object in res.locals so that the next
            * middleware function, or the controller action can access it.
            */
            res.locals.user = results.rows[0];
            next();
          }
          else {
            res.status(401).json({ error: 'User not found.' });
          }

        })
        .catch(error => {
          res.status(401).json({ error: `Unauthorized. ${error}` });
        })
    }
  });
}

function authorizeAdmin(req, res, next) {
  if (!res.locals.user.is_admin) {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  next();
}

function authorizeBookOwner(req, res, next) {
  const bookId = req.params.id;
  const userId = res.locals.user.id;

  pgClient.query('SELECT id FROM books WHERE id = $1 AND user_id = $2', [bookId, userId])
    .then(results => {
      if (results.rowCount > 0) {
        next();
      }
      else {
        /*
        * Here we use a 403 status code because the user is authenticated but not authorized.
        */
        res.status(403).json({ error: 'Unauthorized.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `Error: ${error}.` });
    });
}

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeBookOwner
};