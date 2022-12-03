const { Schema, model } = require("mongoose");

const logoSchema = new Schema({
  name: { type: String, require: true },
  size: { type: String, require: true },
  type: { type: String, require: true },
  rename: { type: String, require: true },
});
export const Logo = model("logofile", logoSchema);
