const express = require("express");
const { ExpressPeerServer } = require("peer");
const http = require("http");
const cors = require("cors");



const app = express();

const server = http.createServer(function (req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello world!");
});

const PORT = 9000;

app.use(express.static("public"));

const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true,
});

app.use("/myapp", peerServer);

server.listen(PORT, () => {
  console.log(`PeerJS server running on port ${PORT}`);
});
