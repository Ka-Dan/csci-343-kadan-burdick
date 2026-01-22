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
    writeResponse(res, 405, `<p>Method ${method} not allowed.</p>`);
    return;
  }

  switch (path) {
    case "/add":
      handleAdd(req, res);
      break;
    case "/subtract":
      handleSubtract(req, res);
      break;
    case "/sum":
      handleSum(req, res);
      break;
    default:
      writeResponse(res, 400, `<p>Invalid path ${path}.</p>`);
      break;
  }
}

function handleAdd(req, res) {
  const query = getQuery(req);

  const a = parseInt(query.a);
  const b = parseInt(query.b);

  const sum = a + b;

  writeResponse(res, 200, `<p>${a} + ${b} = ${sum}</p>`);
}

function handleSubtract(req, res) {
  const query = getQuery(req);

  const a = parseInt(query.a);
  const b = parseInt(query.b);

  const difference = a - b;

  writeResponse(res, 200, `<p>${a} - ${b} = ${difference}</p>`);
}

function handleSum(req, res) {
  const query = getQuery(req);

  /**
   * There are two concepts here that you may not have seen before: instance of and the ternary operator.
   */
  const nums = (query.num instanceof Array ? query.num : [query.num]);

  let sum = 0;

  /**
   * Two more: the forEach loop and arrow function syntax.
   */
  nums.forEach((num) => {
    const value = Number.parseInt(num);
    sum += value;
  });

  writeResponse(res, 200, `<p>Sum: ${sum}</p>`);
}

function getQuery(req) {
  const urlParts = url.parse(req.url, true);
  return urlParts.query;
}

function writeResponse(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/html" });
  res.end(message);
}