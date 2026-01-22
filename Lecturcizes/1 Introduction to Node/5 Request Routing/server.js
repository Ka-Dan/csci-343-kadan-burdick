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

  /**
   * We only want to process requests whose method is GET. Here we check if the method is GET, and if it isn't
   * we return from the handler in order to prevent the rest of the method from executing.
   *
   * This technique is called a guard clause.
   */
  if (method !== "GET") {
    writeResponse(res, 405, `<p>Method ${method} not allowed.</p>`);
    return;
  }

  /**
   * Here we use a switch statement to determine which behavior to execute based on the path of the request.
   */
  switch (path) {
    case "/add":
      handleAdd(req, res);
      break;
    case "/subtract":
      handleSubtract(req, res);
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

/**
 * To keep our code DRY, I've abstracted the behaviors for getting the query parameters from a request and
 * writing a response into the two methods below.
 */

function getQuery(req) {
  const urlParts = url.parse(req.url, true);
  return urlParts.query;
}

function writeResponse(res, status, message) {
  res.writeHead(status, { "Content-Type": "text/html" });
  res.end(message);
}