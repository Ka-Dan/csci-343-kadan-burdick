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
    writeResponse(res, 405, { error: `Method ${method} not allowed.` });
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
      writeResponse(res, 400, { error: `Invalid path ${path}.` });
      break;
  }
}

function handleAdd(req, res) {
  const query = getQuery(req);

  const a = parseInt(query.a);
  const b = parseInt(query.b);

  const sum = a + b;

  writeResponse(res, 200, { result: sum });
}

function handleSubtract(req, res) {
  const query = getQuery(req);

  const a = parseInt(query.a);
  const b = parseInt(query.b);

  const difference = a - b;

  writeResponse(res, 200, { result: difference });
}

function handleSum(req, res) {
  const query = getQuery(req);

  const nums = (query.num instanceof Array ? query.num : [query.num]);

  /**
   * Map and Reduce.
   */
  const sum = nums
    .map((value) => { return parseInt(value) })
    .reduce((total, current) => { return total + current }, 0);

  writeResponse(res, 200, { result: sum });
}

function getQuery(req) {
  const urlParts = url.parse(req.url, true);
  return urlParts.query;
}

function writeResponse(res, status, object) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(object));
}