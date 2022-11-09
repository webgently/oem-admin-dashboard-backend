import { Schema, model } from "mongoose";

const creditSchema = new Schema({
  credit: { type: String, require: true },
  price: { type: String, require: true },
});
export const Credits = model("credits", creditSchema);
