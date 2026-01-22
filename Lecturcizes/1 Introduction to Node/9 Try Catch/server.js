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
  try {
    const query = getQuery(req);

    if (query.a === undefined || query.b === undefined)
      throw Error("Both a and b are required.");

    const a = parseInt(query.a);
    const b = parseInt(query.b);

    if (isNaN(a) || isNaN(b))
      throw Error("Both a and b must be numbers.");

    const sum = a + b;

    writeResponse(res, 200, { result: sum });
  }
  catch (e) {
    console.log(e.message);
    writeResponse(res, 400, { error: e.message });
  }
}

function handleSubtract(req, res) {
  try {
    const query = getQuery(req);

    if (query.a === undefined || query.b === undefined)
      throw Error("Both a and b are required.");

    const a = parseInt(query.a);
    const b = parseInt(query.b);

    if (isNaN(a) || isNaN(b))
      throw Error("Both a and b must be numbers.");

    const difference = a - b;

    writeResponse(res, 200, { result: difference });
  }
  catch (e) {
    console.log(e.message);
    writeResponse(res, 400, { error: e.message });
  }
}

function handleSum(req, res) {
  try {
    const query = getQuery(req);

    if (query.num === undefined)
      throw Error("At leaset two numbers are required.");

    const nums = (query.num instanceof Array ? query.num : [query.num]);

    const sum = nums.map((value) => {
      const number = parseInt(value);

      if (isNaN(number))
        throw Error("All num values must be numbers.");

      return number;
    })
    .reduce((total, current) => { return total + current; }, 0);

    writeResponse(res, 200, { result: sum });
  }
  catch (e) {
    console.log(e.message);
    writeResponse(res, 400, { error: e.message });
  }
}

function getQuery(req) {
  const urlParts = url.parse(req.url, true);
  return urlParts.query;
}

function writeResponse(res, status, object) {
  res.writeHead(status, { "Content-Type": "text/html" });
  res.end(JSON.stringify(object));
}