require("dotenv").config();

const express = require("express");
const session = require("express-session")

const app = express();

const sessionOptions = {
  secret: "Kadan is awesomer",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60_000
  }
};

app.use(session(sessionOptions));

app.use((req, res, next) => {
  req.session.commandCount ||= 0;
  req.session.lastCommand ||= "N/A";

  if (req.path === "/stats") {
    next();
  } else {
    req.session.commandCount++;

    next();
  }
});

app.get("/dotted", handleDotted);
app.get("/fizzBuzz", handleFizzBuzz);
app.get("/gradeStats", handleGradeStats);
app.get("/rectangle", handleRectangle);
app.get("/stats", stats);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function handleDotted(req, res) {
  try {
    setLastCommand(req);

    validateStringQuery([req.query.word1, req.query.word2]);

    const queryWord1 = req.query.word1.trim();
    const queryWord2 = req.query.word2.trim();

    const dotsNeeded = 30 - (queryWord1.length + queryWord2.length);

    if (dotsNeeded < 0)
      throw Error("Too many characters. Reduce the length of word 1 or word 2.");

    const queryString = `<pre>${queryWord1}${'.'.repeat(dotsNeeded)}${queryWord2}</pre>`;

    res.send(`result: ${queryString} commandCount: ${req.session.commandCount}`);
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message, commandCount: req.session.commandCount });
  }
}

function handleFizzBuzz(req, res) {
  try {
    setLastCommand(req);

    validateNumberQuery([req.query.start, req.query.end]);

    const startingInt = parseInt(req.query.start);
    const endInt = parseInt(req.query.end);

    if (startingInt > endInt)
      throw Error("Starting Integer is greater than the Ending Integer.");


    let fizzBuzzString = "";

    const min = Math.min(startingInt, endInt);
    const max = Math.max(startingInt, endInt);

     for (let i = min; i <= max; i++) {
      if (i % 3 === 0) {
        fizzBuzzString += "Fizz";
      }

      if (i % 5 == 0) {
        fizzBuzzString += "Buzz";
      }

      if (i % 3 !== 0 && i % 5 !== 0) {
        fizzBuzzString += i;
      }

      fizzBuzzString += "\n";
    }

    fizzBuzzString = `<pre>${fizzBuzzString}</pre>`;
    console.log(fizzBuzzString)
    res.send(`result: ${fizzBuzzString} commandCount: ${req.session.commandCount}`);
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message, commandCount: req.session.commandCount });
  }
}

function handleGradeStats(req, res) {
  try {
    setLastCommand(req);

    validateNumberQuery(req.query.num)

    const grades = (req.query.num instanceof Array ? req.query.num : [req.query.num]);

    const verifiedGrades = grades.map((value) => {
      const number = parseInt(value);
      return number;
    })

    const min = Math.min(...verifiedGrades);
    const max = Math.max(...verifiedGrades);
    const sum = verifiedGrades.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / verifiedGrades.length;


    res.json({ average: average, min: min, max: max, commandCount: req.session.commandCount });
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message, commandCount: req.session.commandCount });
  }
}

function handleRectangle(req, res) {
  try {
    setLastCommand(req);

    validateNumberQuery([req.query.length, req.query.width]);

    const rectLength = parseInt(req.query.length);
    const rectWidth = parseInt(req.query.width);

    if (rectLength <= 0)
      throw Error("Rectangle Length isn't positive.");

    if (rectWidth <= 0)
      throw Error("Rectangle Width isn't positive.");


    const rectArea = rectLength * rectWidth;
    const rectPerimeter = (rectLength * 2) + (rectWidth * 2);

    res.json({ area: rectArea, perimeter: rectPerimeter, commandCount: req.session.commandCount });
  }
  catch (e) {
    console.log(e.message);
    res.status(400).json({ error: e.message, commandCount: req.session.commandCount });
  }

}

function stats(req, res) {
  res.json({ commandCount: req.session.commandCount, lastCommand: req.session.lastCommand })
}

function validateNumberQuery(obj) {
  if (obj.length < 1)
    throw Error("Query has no content.");

  for (index in obj) {
    if (obj[index] === undefined)
      throw Error(`${obj[index]} at index ${index} is undefine.`);

    if (isNaN(obj[index]))
      throw Error(`${obj[index].trim()} at index ${index} is not a number.`);

    if (obj[index] === null)
      throw Error(`Index ${index} is null.`);

    if (obj[index] && !obj[index].trim())
      throw Error(`The query at index ${index} is empty.`);
  }
}

function validateStringQuery(obj) {
  for (index in obj) {
    if (obj[index] && !obj[index].trim())
      throw Error(`The query at index ${index} is empty.`);
  }
}

function setLastCommand(req) {
  req.session.lastCommand = req.path;
}