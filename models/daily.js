const { Schema, model } = require("mongoose");

const dailySchema = new Schema({
  day: { type: String, require: true },
  open: { type: String, require: true },
  close: { type: String, require: true },
  holyday: { type: Boolean, require: true },
});
const Daily = model("daily", dailySchema);
module.exports = { Daily };
