import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
  serviceType: { type: String, require: true },
  status: { type: String, require: true },
});
export const Service = model("service", serviceSchema);
