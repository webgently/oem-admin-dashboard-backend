import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import useragent from "express-useragent";
import path from "path";
import dir from "./src/dir.js";
import mongoose from "./src/config/mongoose";
import router from "./src/router";

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
