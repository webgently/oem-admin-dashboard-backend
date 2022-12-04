const { Schema, model } = require("mongoose");

const forgotSchema = new Schema({
  email: { type: String, require: true },
  link: { type: String, require: true },
  sendDate: { type: Number, require: true },
});
const Forgot = model("forgot", forgotSchema);
module.exports = { Forgot };
