const { Schema, model } = require("mongoose");

const feeSchema = new Schema({
  fee: { type: Number, require: true },
});
const Fee = model("fee", feeSchema);
module.exports = { Fee };
