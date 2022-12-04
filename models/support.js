const { Schema, model } = require("mongoose");

const supportSchema = new Schema({
  from: { type: String, require: true },
  to: { type: String, require: true },
  msg: { type: String, require: true },
  date: { type: String, require: true },
  status: { type: Boolean, require: true },
});

const Support = model("support", supportSchema);
module.exports = { Support };
