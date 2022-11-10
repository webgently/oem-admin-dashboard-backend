import { Schema, model } from "mongoose";

const priceSchema = new Schema({
  serviceType: { type: String, require: true },
  service: { type: String, require: true },
  credit: { type: String, require: true },
});
export const Prices = model("price", priceSchema);
