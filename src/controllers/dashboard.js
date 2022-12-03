const { Service } = require("../models/service");
const { Users } = require("../models/sign");
const { Support } = require("../models/support");
const { Upload } = require("../models/user/uploadFile");
const { Daily } = require("../models/daily");

const getDashBoardData = async (req, res, next) => {
  try {
    let dashboard = {};
    const user = await Users.find({});
    const service = await Service.find({});
    const upload = await Upload.find({});
    const upload1 = await Upload.findOne({ readStatus: false });
    const support = await Support.find({
      $and: [{ from: { $not: { $lte: req.body.id } } }, { status: false }],
    });
    dashboard.userCount = user.length;
    dashboard.serviceCount = service.length;
    dashboard.requestCount = upload.length;
    dashboard.supportCount = support.length;
    if (upload1) dashboard.requestAlert = false;
    else dashboard.requestAlert = true;
    res.send(dashboard);
  } catch (error) {
    console.log(error);
  }
};

const getServiceTime = async (req, res, next) => {
  try {
    const result = await Daily.findOne({ day: req.body.day });
    res.send({ status: true, data: result });
  } catch (error) {
    console.log(error);
  }
};

const getSumCredit = async (req, res, next) => {
  try {
    const result = await Users.findOne({ _id: req.body.id });
    res.send({ status: true, data: result.credit });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getDashBoardData,
  getServiceTime,
  getSumCredit,
};
