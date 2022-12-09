const { Schema, model } = require("mongoose");

const creditSchema = new Schema({
  orderId: { type: String, require: true },
  userId: { type: String, require: true },
  client: { type: String, require: true },
  fileName: { type: Array, require: true },
  fileSize: { type: Array, require: true },
  fileType: { type: Array, require: true },
  fileRename: { type: Array, require: true },
  vehicleType: { type: String, require: true },
  vehicleBrand: { type: String, require: true },
  vehicleSeries: { type: String, require: true },
  buildYear: { type: String, require: true },
  HP: { type: Number, require: true },
  KW: { type: Number, require: true },
  transmission: { type: String, require: true },
  VINnumber: { type: String, require: true },
  tuningType: { type: String, require: true },
  extras: { type: String, require: true },
  message: { type: String, require: true },
  note: { type: String, require: true },
  status: { type: String, require: true },
  createdAt: { type: String, require: true },
  readStatus: { type: Boolean, require: true },
});
const Upload = model("upload", creditSchema);
module.exports = { Upload };
