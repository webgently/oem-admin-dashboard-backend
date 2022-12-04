const { Schema, model } = require("mongoose");

const privacySchema = new Schema({
  privacy: { type: String, require: true },
});
const Privacy = model("privacy", privacySchema);
module.exports = { Privacy };
