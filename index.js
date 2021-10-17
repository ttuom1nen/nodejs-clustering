const cluster = require("cluster");

// Is the file being executed in master mode?
if (cluster.isMaster) {
  // index.js is executed again but in child mode
  cluster.fork();
} else {
  // This is the child mode. It will act as server and nothing else
  const express = require("express");
  const app = express();

  function doWork(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {}
  }

  app.get("/", (req, res) => {
    doWork(5000);
    res.send("Hi there");
  });

  // Thanks to the cluster, this route is not blocked while the above one is loading.
  // Add more clusters to make faster.
  app.get("/fast", (req, res) => {
    res.send("This was fast!");
  });

  app.listen(3000);
}
