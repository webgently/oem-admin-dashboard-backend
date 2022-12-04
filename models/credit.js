const { Schema, model } = require("mongoose");

const creditSchema = new Schema({
  credit: { type: String, require: true },
  price: { type: String, require: true },
});
const Credits = model("credits", creditSchema);
module.exports = { Credits };
