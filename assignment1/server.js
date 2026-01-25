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
    case "rectangle":
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


    const word1 = query.word1;
    const word2 = query.word2;

    const dots = 30 - (word1.length + word2.length);

    const queryString = `<pre>${word1}${'.'.repeat(dots)}${word2}</pre>`;

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


    const start = parseInt(query.start);
    const end = parseInt(query.end);

    if (isNaN(start) || isNaN(end))
      throw Error("Both a and b must be numbers.");

    let fizzBuzzString = "";

    const min = Math.min(start, end);
    const max = Math.max(start, end);

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
      throw Error("At least two numbers are required.");

    const nums = (query.num instanceof Array ? query.num : [query.num]);

    const sum = nums.map((value) => {
      const number = parseInt(value);

      if (isNaN(number))
        throw Error("All num values must be numbers.");

      return number;
    })
    .reduce((total, current) => { return total + current; }, 0);

    writeResponse(res, 200, { result: sum});
  }
  catch (e) {
    console.log(e.message);
    writeResponse(res, 400, { error: e.message});
  }
}

function handleRectangle(req, res) {

}

function getQuery(req) {
  const urlParts = url.parse(req.url, true);
  return urlParts.query;
}

function writeResponse(res, status, object, isHtml = false) {
  res.writeHead(status, { "Content-Type": "text/html" });

  if (isHtml) {
    res.end(object);
  } else {
    res.end(JSON.stringify(object));
  }
}