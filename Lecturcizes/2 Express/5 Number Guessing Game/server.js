require("dotenv").config();

const express = require("express");
const session = require("express-session")

const app = express();

const sessionOptions = {
  secret: "Mike is awesome",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60_000 }
};
app.use(session(sessionOptions));

app.get("/", instructions);
app.get("/play", play);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function play(req, res) {
  const guess = parseInt(req.query.guess);

  if (req.session.answer == undefined) {
    req.session.guesses = 0;
    req.session.answer = Math.floor(Math.random() * 100) + 1;
  }

  if (req.query.guess === undefined) {
    req.session.guesses = 0;
    req.session.answer = Math.floor(Math.random() * 100) + 1;
    res.json({ message: "Pick a number from 1 to 100." });
  }
  else if (isNaN(guess)) {
    res.status(400).json({ error: "Your guess must be a number." });
  }
  else if (guess > 100) {
    res.status(400).json({ error: "Your guess must be less than 100." });
  }
  else if (guess < 1) {
    res.status(400).json({ error: "Your guess must be greater than or equal to 1." });
  }
  else if (guess === req.session.answer) {
    req.session.guesses++;
    const result = { message: `Correct! It took you ${req.session.guesses} guesses. Play again!`, guesses: req.session.guesses };

    req.session.guesses = 0;
    req.session.answer = undefined;

    res.json(result);
  }
  else if (guess > req.session.answer) {
    req.session.guesses++;
    res.json({ message: "Too high. Guess again!", guesses: req.session.guesses });
  }
  else if (guess < req.session.answer) {
    req.session.guesses++;
    res.json({ message: "Too low. Guess again!", guesses: req.session.guesses });
  }
  else {
    res.status(400).json({ error: "There's something wrong with your request" });
  }
}

function instructions(req, res) {
  res.send(
    "<h1>Number Guessing Game</h1>" +
    "<p>Use /game/play to start a new game.</p>" +
    "<p>Use /game/play?guess=num to make a guess.</p>"
  );
}