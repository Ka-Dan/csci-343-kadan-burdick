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

module.exports = {
  authenticate
};