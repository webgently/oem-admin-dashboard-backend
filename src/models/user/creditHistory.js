import { Schema, model } from "mongoose";

const creditHistorySchema = new Schema({
  userId: { type: String, require: true },
  orderId: { type: String, require: true },
  credit: { type: Number, require: true },
  date: { type: String, require: true },
});
export const CreditHistory = model("creditHistory", creditHistorySchema);
