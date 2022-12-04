const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const useragent = require("express-useragent");
const path = require("path");
const mongoose = require("./config/mongoose");
const router = require("./router");

mongoose();

const port = 2083;
const app = express();
const http = require("http").createServer(app);
const socket = require("./socket/index.js");

app.use(useragent.express());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));
app.use(bodyParser.text({ type: "text/html" }));

app.use(express.static(__dirname + "/build"));
app.use(express.static(path.join(__dirname, "upload")));

app.use("/api", router);
app.get("*", (req, res) => res.sendFile(__dirname + "/build/index.html"));

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
