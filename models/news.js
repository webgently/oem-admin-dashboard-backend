const { Schema, model } = require("mongoose");

const newSchema = new Schema({
  new: { type: String, require: true },
});
const New = model("new", newSchema);
module.exports = { New };