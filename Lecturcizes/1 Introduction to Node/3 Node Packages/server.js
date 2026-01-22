/**
 * Here you are being introduced to Node packages (or libraries). Your project itself is a
 * Node package. We will use a package.json file to manage our project's dependencies and
 * other meta information. To get started, we can run "npm init" in the terminal while in
 * our project's directory. This will prompt us with a few questions and create a package.json
 * file for us.
 *
 * Then we can run "npm install dotenv --save" which will install the dotenv package in our
 * project. The --save option will write an entry for this package into our package.json file.
 *
 *
 * dotenv is a popular Node library for managing default environment variable values for
 * your development environment.
 *
 * Any environment variables set in the OS will override the default values set in the
 * .env file.
 *
 * Learn more at:
 * https://www.npmjs.com/package/dotenv
 */
require("dotenv").config();

const http = require("http");

const server = http.createServer(requestHandler);
server.listen(process.env.PORT, process.env.HOST, startHandler);

function startHandler() {
  const address = server.address();
  console.log(`Server listening at ${address.address}:${address.port}`);
}

function requestHandler(req, res) {
  console.log("Handling request.");

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<p>Hello.</p>");
  res.end("<p>Have a nice day!</p>");
}