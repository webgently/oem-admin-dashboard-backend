const mongoose = require("mongoose");
const config = require("./index");
const { Users } = require("../models/sign");
require("dotenv").config();

module.exports = () => {
  mongoose
    .connect(config.test, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Database is connected");
    });
  makeAdmin();
};

const makeAdmin = async () => {
  try {
    let adminInfo = {
      name: "admin",
      email: process.env.SUPPORT_EMAIL,
      phone: "",
      address: "",
      city: "",
      country: "",
      zcode: "",
      subcontinent: "",
      vatNumber: "",
      checkflag: "",
      password: "12345678",
      permission: "admin",
      note: "",
      date: "",
      credit: 0,
      status: "active",
      profile: "",
    };
    const admin = await Users.findOne({ email: process.env.SUPPORT_EMAIL });
    if (!admin) {
      const newUser = new Users(adminInfo);
      const result = await newUser.save();
    }
  } catch (error) {
    throw error;
  }
};
