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

  /**
   * Here you are being introduced to the Node URL module. We are using the parse method to
   * get the query parameters of the URL as an object.
   *
   * You can learn more about the URL module here:
   * https://www.w3schools.com/nodejs/nodejs_url.asp
   */
  const urlParts = url.parse(req.url, true);
  const query = urlParts.query;
  console.log(query);

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<ul>");

  /**
   * This for in syntax may be new to you. The Javascript for in loop will iterate over an object.
   * In for(const x in object), the loop will iterate over the object for each of its attributes. In
   * this case, x will be the key of the attribute. When object is an array, the loop will iterate
   * over the array and x will be the index of the element.
   *
   * You can learn more about the for in loop here:
   * https://www.w3schools.com/js/js_loop_forin.asp
   */
  for (let key in query) {
    res.write(`<li>${key}: ${query[key]}</li>`);
  }
  res.end("</ul>");
}