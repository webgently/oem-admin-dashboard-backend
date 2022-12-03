const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const useragent = require("express-useragent");
const path = require("path");
const dir = require("./src/dir.js");
const mongoose = require("./src/config/mongoose");
const router = require("./src/router");

mongoose();

const port = 2083;
const app = express();
const http = require("http").createServer(app);
const socket = require("./src/socket/index.js");

app.use(useragent.express());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.use(express.static(dir.dirname + "/build"));
app.use(express.static(path.join(__dirname, "upload")));

app.use("/api", router);
app.get("*", (req, res) => res.sendFile(dir.dirname + "/build/index.html"));

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
socket(io);
app.set("io", io);
http.listen(port, () => {
  console.log("server listening on:", port);
});
