// Set threadpool to 2 just for testing
process.env.UV_THREADPOOL_SIZE = 2;
const cluster = require("cluster");

// Is the file being executed in master mode?
if (cluster.isMaster) {
  // index.js will be executed again but in child mode
  cluster.fork();
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
  // Add more clusters to make faster. Adding too many clusters may have negative effect.
  // The negative effects are due to cpu limitations. Bottleneck of mediocrity.
  app.get("/fast", (req, res) => {
    res.send("This was fast!");
  });

  app.listen(3000);
}
