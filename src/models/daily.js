import { Schema, model } from "mongoose";

const dailySchema = new Schema({
  day: { type: String, require: true },
  open: { type: String, require: true },
  close: { type: String, require: true },
  holyday: { type: Boolean, require: true },
});
export const Daily = model("daily", dailySchema);
