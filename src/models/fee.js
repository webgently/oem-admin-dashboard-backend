const { Schema, model } = require("mongoose");

const feeSchema = new Schema({
  fee: { type: Number, require: true },
});
export const Fee = model("fee", feeSchema);
