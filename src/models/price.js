const { Schema, model } = require("mongoose");

const priceSchema = new Schema({
  serviceType: { type: String, require: true },
  service: { type: String, require: true },
  credit: { type: String, require: true },
});
const Prices = model("price", priceSchema);
module.exports = { Prices };
