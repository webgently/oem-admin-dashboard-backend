const { Schema, model } = require("mongoose");

const usersSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  address: { type: String, require: true },
  city: { type: String, require: true },
  country: { type: String, require: true },
  zcode: { type: String, require: true },
  subcontinent: { type: String, require: true },
  vatNumber: { type: String, require: true },
  checkflag: { type: String, require: true },
  password: { type: String, require: true },
  permission: { type: String, require: true },
  note: { type: String, require: true },
  date: { type: String, require: true },
  credit: { type: Number, require: true },
  status: { type: String, require: true },
  profile: { type: String, require: true },
  support: { type: Boolean, require: true },
});
const Users = model("users", usersSchema);
module.exports = { Users };
