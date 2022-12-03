const { Schema, model } = require("mongoose");

const creditSchema = new Schema({
  _id: { type: Object, require: true },
  userId: { type: String, require: true },
  dataId: { type: String, require: true },
  orderId: { type: String, require: true },
  name: { type: String, require: true },
  profile: { type: String, require: true },
});

export const fileChattingList = model("fileChattingList", creditSchema);
