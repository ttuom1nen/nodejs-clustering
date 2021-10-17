// Set threadpool to 1 just for testing
process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require("cluster");

// Is the file being executed in master mode?
if (cluster.isMaster) {
  // index.js is executed again but in child mode
  cluster.fork();
} else {
  // This is the child mode. It will act as server and nothing else
  const express = require("express");
  const crypto = require("crypto");
  const app = express();

  // This is to simulate work
  app.get("/", (req, res) => {
    crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
      res.send("Hi there");
    });
  });

  // Thanks to the cluster, this route is not blocked while the above one is loading.
  // Add more clusters to make faster.
  app.get("/fast", (req, res) => {
    res.send("This was fast!");
  });

  app.listen(3000);
}
