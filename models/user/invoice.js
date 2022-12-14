const { Schema, model } = require("mongoose");

const creditSchema = new Schema({
  userId: { type: String, require: true },
  name: { type: String, require: true },
  email: { type: String, require: true },
  vatNumber: { type: String, require: true },
  receipt: { type: String, require: true },
  credits: { type: Number, require: true },
  netAmount: { type: Number, require: true },
  date: { type: String, require: true },
  method: { type: String, require: true },
  fee: { type: Number, require: true },
  vatCharge: { type: Number, require: true },
});

const Invoice = model("invoice", creditSchema);
module.exports = { Invoice };
