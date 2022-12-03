const { Schema, model } = require("mongoose");

const privacySchema = new Schema({
  privacy: { type: String, require: true },
});
export const Privacy = model("privacy", privacySchema);
