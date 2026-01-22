const http = require("http");
const server = http.createServer(requestHandler);

/**
 * This may be the first time you are being exposed to environment varialbes.
 * An environment variable is a variable whose value is set outside of the program,
 * usually through functionality built into the operating system or service container.
 *
 * Here is more on environment variables and how they are used in Node:
 * https://medium.com/chingu/an-introduction-to-environment-variables-and-how-to-use-them-f602f66d15fa
 * https://nodejs.dev/en/learn/how-to-read-environment-variables-from-nodejs/
 */
server.listen(process.env.PORT, process.env.HOST, startHandler);

function startHandler() {
  const address = server.address();

  /**
   * You should remember this syntax from Advanced Web development. This is called a template literal (or
   * template string). It has a few uses. We are using it for string interpolation (inserting expressions
   * directly into our string).
   *
   * You can learn more about Javascript template literals here:
   * https://www.w3schools.com/js/js_string_templates.asp
   */
  console.log(`Server listening at ${address.address}:${address.port}`);
}

function requestHandler(req, res) {
  console.log("Handling request.");

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<p>Hello.</p>");
  res.end("<p>Have a nice day!</p>");
}