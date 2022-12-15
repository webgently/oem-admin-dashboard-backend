const mongoose = require("mongoose");
const { Service } = require("../models/service");
const { Users } = require("../models/sign");
const { Support } = require("../models/support");
const { Upload } = require("../models/user/uploadFile");
const { fileChattingList } = require("../models/user/fileChattingList");
const { Daily } = require("../models/daily");

const getDashBoardData = async (req, res, next) => {
  try {
    let dashboard = {};
    const user = await Users.find({});
    const service = await Service.find({});
    const upload = await Upload.find({});
    const upload1 = await Upload.findOne({ readStatus: false });
    let supportUnreadCount = 0;
    let archiveUnreadCount = 0;
    const data = await Support.find(
      {
        $and: [{ to: req.body.id }, { status: false }],
      },
      { from: 1, _id: 0 }
    );
    const idArray = data.map((item) => item.from);
    const list = idArray.filter(
      (item, index) => idArray.indexOf(item) === index
    );
    const counts = {};
    idArray.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    const userArray = list.filter((s) => {
      if (s.length < 25) return mongoose.Types.ObjectId(s);
    });
    const fileArray = list.filter((s) => {
      if (s.length > 25) return s;
    });
    const support1 = await Users.find(
      { _id: { $in: userArray } },
      { _id: 0, support: 1 }
    );
    const support2 = await fileChattingList.find(
      { _id: { $in: fileArray } },
      { _id: 0, support: 1 }
    );
    userArray.map((item, ind) => {
      if (support1[ind].support) supportUnreadCount += counts[item];
      else archiveUnreadCount += counts[item];
    });
    fileArray.map((item, ind) => {
      if (support2[ind].support) supportUnreadCount += counts[item];
      else archiveUnreadCount += counts[item];
    });
    dashboard.userCount = user.length;
    dashboard.serviceCount = service.length;
    dashboard.requestCount = upload.length;
    dashboard.supportUnreadCount = supportUnreadCount;
    dashboard.archiveUnreadCount = archiveUnreadCount;
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
