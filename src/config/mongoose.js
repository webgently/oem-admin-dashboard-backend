const mongoose = require("mongoose");
const config = require("./index");

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
};
