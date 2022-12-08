const { Schema, model } = require("mongoose");

const bgSchema = new Schema({
  name: { type: String, require: true },
  size: { type: String, require: true },
  type: { type: String, require: true },
  rename: { type: String, require: true },
});
const Bg = model("bgfile", bgSchema);
module.exports = { Bg };
