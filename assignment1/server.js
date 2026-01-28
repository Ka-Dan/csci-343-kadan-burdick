require("dotenv").config();

const http = require("http");
const url = require("url");
const { diff } = require("util");

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
    writeResponse(res, 405, { error: `Method ${method} not allowed.`});
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
      writeResponse(res, 400, { error: `Invalid path ${path}.`});
      break;
  }
}

function handleDotted(req, res) {
  try {
    const query = getQuery(req);

    if (query.word1 === undefined || query.word2 === undefined)
      throw Error("Both word 1 and word 2 are required.");


    const queryWord1 = query.word1;
    const queryWord2 = query.word2;

    const dotsNeeded = 30 - (queryWord1.length + queryWord2.length);

    const queryString = `<pre>${queryWord1}${'.'.repeat(dotsNeeded)}${queryWord2}</pre>`;

    writeResponse(res, 200, queryString , true);
  }
  catch (e) {
    console.log(e.message);
    writeResponse(res, 400, { error: e.message });
  }
}

function handleFizzBuzz(req, res) {
  try {
    const query = getQuery(req);

    if (query.start === undefined || query.end === undefined)
      throw Error("Both a and b are required.");


    const startingInt = parseInt(query.start);
    const endInt = parseInt(query.end);

    if (isNaN(startingInt) || isNaN(endInt))
      throw Error("Both a and b must be numbers.");

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
    writeResponse(res, 200, fizzBuzzString , true);
  }
  catch (e) {
    console.log(e.message);
    writeResponse(res, 400, { error: e.message});
  }
}

function handleGradeStats(req, res) {
  try {
    const query = getQuery(req);

    if (query.num === undefined)
      throw Error("At least one number is required.");

    const queryValues = (query.num instanceof Array ? query.num : [query.num]);

    const verifiedNums = queryValues.map((value) => {
      const number = parseInt(value);

      if (isNaN(number))
        throw Error("All num values must be numbers.");

      return number;
    })

    const min = Math.min(...verifiedNums);
    const max = Math.max(...verifiedNums);
    const sum = verifiedNums.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = sum / verifiedNums.length;

    writeResponse(res, 200, { average: average, min: min, max: max});
  }
  catch (e) {
    console.log(e.message);
    writeResponse(res, 400, { error: e.message});
  }
}

function handleRectangle(req, res) {
  try {
    const query = getQuery(req);

    if (query.length === undefined || query.width === undefined)
      throw Error("both numbers are required.");

    const rectLength = parseInt(query.length);
    const rectWidth = parseInt(query.width);

    if (isNaN(rectLength) || isNaN(rectWidth))
      throw Error("One or more inputs aren't a number.")

    const rectArea = rectLength * rectWidth;
    const rectPerimeter = (rectLength * 2) + (rectWidth * 2);

    writeResponse(res, 200, { area: rectArea, perimeter: rectPerimeter});
  }
  catch (e) {
    console.log(e.message);
    writeResponse(res, 400, { error: e.message});
  }
}

function getQuery(req) {
  const urlParts = url.parse(req.url, true);
  return urlParts.query;
}

function writeResponse(res, status, object, isHtml = false) {
  if (isHtml) {
    res.writeHead(status, { "Content-Type": "text/html" });
    res.end(object);
  } else {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(object));
  }
}