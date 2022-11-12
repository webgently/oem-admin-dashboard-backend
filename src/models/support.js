import { Schema, model } from "mongoose";

const supportSchema = new Schema({
  from: { type: String, require: true },
  to: { type: String, require: true },
  msg: { type: String, require: true },
  date: { type: String, require: true },
});

export const Support = model("support", supportSchema);
