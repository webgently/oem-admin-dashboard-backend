import { Schema, model } from "mongoose";

const creditHistorySchema = new Schema({
  userId: { type: String, require: true },
  orderId: { type: String, require: true },
  credit: { type: String, require: true },
  date: { type: String, require: true },
});
export const CreditHistory = model("creditHistory", creditHistorySchema);
