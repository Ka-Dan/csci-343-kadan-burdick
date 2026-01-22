require("dotenv").config();

const express = require("express");

const app = express();

app.get("/add", add);
app.get("/subtract", subtract);
app.get("/sum", sum);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function add(req, res) {
  try {
    if (req.query.a === undefined || req.query.b === undefined)
      throw Error("Both a and b are required.");

    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    if (isNaN(a) || isNaN(b))
      throw Error("Both a and b must be numbers.");

    const sum = a + b;

    /**
     * Here we are instroduced to the Express res.json method.
     * This is a special utility function of an Express response that allows us to set the content type
     * header, the status, and the body of the request in one easy call.
     */
    res.json({ result: sum });
  }
  catch (e) {
    console.log(e.message);

    /**
     * We can also customize the status and headers if we need to. Here we are overriding the status to
     * be 400 when we have an error.
     */
    res.status(400).json({ error: e.message });
  }
}

function subtract(req, res) {
  try {
    if (req.query.a === undefined || req.query.b === undefined)
      throw Error("Both a and b are required.");

    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);

    if (isNaN(a) || isNaN(b))
      throw Error("Both a and b must be numbers.");

    const difference = a - b;

    res.json({ result: difference });
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message });
  }
}

function sum(req, res) {
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

    res.json({ result: sum });
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message });
  }
}