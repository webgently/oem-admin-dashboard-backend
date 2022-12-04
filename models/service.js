const { Schema, model } = require("mongoose");

const serviceSchema = new Schema({
  serviceType: { type: String, require: true },
  status: { type: String, require: true },
});
const Service = model("service", serviceSchema);
module.exports = { Service };
