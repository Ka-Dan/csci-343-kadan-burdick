require("dotenv").config();

const express = require("express");
const session = require("express-session")

const app = express();

const sessionOptions = {
  secret: "Mike is awesome",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60_000
  }
};

/**
 * Middleware and the .use function.
 */
app.use(session(sessionOptions));

app.get("/add", add);
app.get("/subtract", subtract);
app.get("/sum", sum);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function add(req, res) {
  req.session.commandCount ||= 0;
  req.session.commandCount++;

  try {
    if (req.query.a === undefined || req.query.b === undefined)
      throw Error("Both a and b are required.");

    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    if (isNaN(a) || isNaN(b))
      throw Error("Both a and b must be numbers.");

    const sum = a + b;
    res.json({ result: sum, commandCount: req.session.commandCount });
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message, commandCount: req.session.commandCount });
  }
}

function subtract(req, res) {
  req.session.commandCount ||= 0;
  req.session.commandCount++;

  try {
    if (req.query.a === undefined || req.query.b === undefined)
      throw Error("Both a and b are required.");

    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    if (isNaN(a) || isNaN(b))
      throw Error("Both a and b must be numbers.");

    const difference = a - b;

    res.json({ result: difference, commandCount: req.session.commandCount });
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message, commandCount: req.session.commandCount });
  }
}

function sum(req, res) {
  req.session.commandCount ||= 0;
  req.session.commandCount++;

  try {
    if (req.query.num === undefined)
      throw Error("At leaset two numbers are required.");

    const nums = (req.query.num instanceof Array ? req.query.num : [req.query.num]);

    const sum = nums.map((value) => {
      const number = parseInt(value);

      if (isNaN(number))
        throw Error("All num values must be numbers.");

      return number;
    })
    .reduce((total, current) => { return total + current; }, 0);

    res.json({ result: sum, commandCount: req.session.commandCount });
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message, commandCount: req.session.commandCount });
  }
}