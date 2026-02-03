require("dotenv").config();

const http = require("http");
const url = require("url");

const server = http.createServer(requestHandler);
server.listen(process.env.PORT, process.env.HOST, startHandler);

function startHandler() {
  const address = server.address();
  console.log(`Server listening at ${address.address}:${address.port}`);
}

function requestHandler(req, res) {
  console.log("Handling request.");

  const path = url.parse(req.url).pathname;
  const method = req.method;

  if (method !== "GET") {
    writeJsonResponse(res, 405, { error: `Method ${method} not allowed.`});
    return;
  }

  switch (path) {
    case "/dotted":
      handleDotted(req, res);
      break;
    case "/fizzBuzz":
      handleFizzBuzz(req, res);
      break;
    case "/gradeStats":
      handleGradeStats(req, res);
      break;
    case "/rectangle":
      handleRectangle(req, res);
      break;
    default:
      writeJsonResponse(res, 400, { error: `Invalid path ${path}.`});
      break;
  }
}

function handleDotted(req, res) {
  try {
    const query = getQuery(req);

    validateStringQuery([query.word1, query.word2]);

    const queryWord1 = query.word1;
    const queryWord2 = query.word2;

    const dotsNeeded = 30 - (queryWord1.length + queryWord2.length);

    const queryString = `<pre>${queryWord1}${'.'.repeat(dotsNeeded)}${queryWord2}</pre>`;

    writeHtmlResponse(res, 200, queryString , true);
  }
  catch (e) {
    console.log(e.message);
    writeHtmlResponse(res, 400, `error: ${e.message}`);
  }
}

function handleFizzBuzz(req, res) {
  try {
    const query = getQuery(req);

    validateNumbersQuery([query.start, query.end]);

    const startingInt = parseInt(query.start);
    const endInt = parseInt(query.end);

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
        fizzBuzzString += i
      }

      fizzBuzzString += "\n"
    }

    fizzBuzzString = `<pre>${fizzBuzzString}</pre>`
    writeHtmlResponse(res, 200, fizzBuzzString , true);
  }
  catch (e) {
    console.log(e.message);
    writeHtmlResponse(res, 400, `error: ${e.message}`);
  }
}

function handleGradeStats(req, res) {
  try {
    const query = getQuery(req);

    validateNumbersQuery(query.grades);

    const grades = (query.grades instanceof Array ? query.grades : [query.grades]);

    const verifiedGrades = grades.map((value) => {
      const number = parseInt(value);
      return number;
    })

    const min = Math.min(...verifiedGrades);
    const max = Math.max(...verifiedGrades);
    const sum = verifiedGrades.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / verifiedGrades.length;

    writeJsonResponse(res, 200, { average: average, min: min, max: max});
  }
  catch (e) {
    console.log(e.message);
    writeJsonResponse(res, 400, { error: e.message});
  }
}

function handleRectangle(req, res) {
  try {
    const query = getQuery(req);

    validateNumbersQuery([query.length, query.width]);

    const rectLength = parseInt(query.length);
    const rectWidth = parseInt(query.width);

    const rectArea = rectLength * rectWidth;
    const rectPerimeter = (rectLength * 2) + (rectWidth * 2);

    writeJsonResponse(res, 200, { area: rectArea, perimeter: rectPerimeter});
  }
  catch (e) {
    console.log(e.message);
    writeJsonResponse(res, 400, { error: e.message});
  }
}

function getQuery(req) {
  const urlParts = url.parse(req.url, true);
  return urlParts.query;
}

function validateStringQuery(obj) {
  for (res in obj) {
    if (res === undefined)
      throw Error("One or more inputs are undefined.");
  }
}

function validateNumbersQuery(obj) {
  for (res in obj) {
    if (obj[res] === undefined)
      throw Error("One or more inputs are undefined.");

    if (isNaN(obj[res]))
      throw Error("One or more inputs are not a number.");
  }
}

function writeHtmlResponse(res, status, object) {
  res.writeHead(status, { "Content-Type": "text/html" });
  res.end(object);
}

function writeJsonResponse(res, status, object) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(object));
}