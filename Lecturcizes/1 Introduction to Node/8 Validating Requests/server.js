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

  if (query.a === undefined || query.b === undefined) {
    writeResponse(res, 400, { error: "Both a and b are required." });
    return;
  }

  const a = parseInt(query.a);
  const b = parseInt(query.b);

  if (isNaN(a) || isNaN(b)) {
    writeResponse(res, 400, { error: "Both a and b must be numbers." });
    return;
  }

  const sum = a + b;

  writeResponse(res, 200, { result: sum });
}

function handleSubtract(req, res) {
  const query = getQuery(req);

  if (query.a === undefined || query.b === undefined) {
    writeResponse(res, 400, { error: "Both a and b are required." });
    return;
  }

  const a = parseInt(query.a);
  const b = parseInt(query.b);

  if (isNaN(a) || isNaN(b)) {
    writeResponse(res, 400, { error: "Both a and b must be numbers." });
    return;
  }

  const difference = a - b;

  writeResponse(res, 200, { result: difference });
}

function handleSum(req, res) {
  const query = getQuery(req);

  if (query.num === undefined) {
    writeResponse(res, 400, { error: "At leaset two numbers are required." });
    return;
  }

  const nums = (query.num instanceof Array ? query.num : [query.num]);

  /**
   * There's one more request validation we should do in this method: We should make
   * sure that all values in the num Array are numbers. This is a pain to do the way
   * we did the others in this file. So let's address it in the next Lecturcize.
   */
  const sum = nums.map((value) => { return parseInt(value); })
    .reduce((total, current) => { return total + current; }, 0);

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