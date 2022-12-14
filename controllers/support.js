const mongoose = require("mongoose");
const { Users } = require("../models/sign");
const { Support } = require("../models/support");
const { fileChattingList } = require("../models/user/fileChattingList");

const getSupportID = async (req, res, next) => {
  try {
    const admin = await Users.findOne({ permission: "admin" });
    res.send({ status: true, data: admin._id });
  } catch (error) {
    console.log(error);
  }
};

const getUserList = async (req, res, next) => {
  try {
    const list = await Users.find(
      {
        $and: [
          { _id: { $not: { $lte: req.body.id } } },
          { name: { $regex: req.body.search } },
          { support: true },
        ],
      },
      { _id: 1, name: 1, profile: 1 }
    );
    const unreadCount = {};
    const fileList = await fileChattingList.find(
      {
        $and: [{ name: { $regex: req.body.search } }, { support: true }],
      },
      { _id: 1, name: 1, profile: 1 }
    );
    const userList = list.concat(fileList);

    await userList.forEach(async (element) => {
      const unreadmsg = await Support.find({
        $and: [{ from: element._id }, { status: false }],
      });
      unreadCount[element._id] = unreadmsg.length;
    });
    await sleep(100);
    res.send({ status: true, userList, unreadCount: unreadCount });
  } catch (error) {
    console.log(error);
  }
};

const getChattingHistory = async (req, res, next) => {
  try {
    const support = await Support.find(
      {
        $or: [{ from: req.body.id }, { to: req.body.id }],
      },
      { _id: 0, from: 1, to: 1, msg: 1, date: 1, status: 1 }
    );
    res.send({ status: true, data: support });
  } catch (error) {
    console.log(error);
  }
};

const updateReadStatus = async (req, res, next) => {
  try {
    await Support.updateMany(
      {
        $and: [{ from: req.body.from }, { to: req.body.to }],
      },
      { status: true }
    );
    req.app.get("io").emit("checkUnreadCount" + req.body.to);
    res.send({ status: true });
  } catch (error) {
    console.log(error);
  }
};

const getUserUnreadCount = async (req, res, next) => {
  try {
    const data = await Support.find({
      $and: [{ to: req.body.id }, { status: false }],
    });
    res.send({ status: true, unreadCount: data.length });
  } catch (error) {
    console.log(error);
  }
};

const getUserUnreadPerFileCount = async (req, res, next) => {
  try {
    const fileList = await fileChattingList.find(
      { userId: req.body.id },
      { _id: 1 }
    );
    let unreadCount = 0;
    await fileList.forEach(async (element) => {
      const unreadmsg = await Support.find({
        $and: [{ to: element._id }, { status: false }],
      });
      unreadCount += unreadmsg.length;
    });
    await sleep(100);
    res.send({ status: true, unreadCount });
  } catch (error) {
    console.log(error);
  }
};

const updateUserReadStatus = async (req, res, next) => {
  try {
    await Support.updateMany(
      {
        to: req.body.id,
      },
      { status: true }
    );
    res.send({ status: true });
  } catch (error) {
    console.log(error);
  }
};

const uploadChatFile = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};

const sendToUserPerFile = async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  data.msg = `${req.files[0].originalname}->${req.files[0].filename}->file`;
  try {
    const support = new Support(data);
    const result = await support.save();
    if (result) {
      const alertMsg = `Received message of admin about your upload file-${req.body.orderId}`;
      await req.app.get("io").emit(data.to, { data });
      await req.app.get("io").emit("fileReply" + data.to.substr(0, 24), {
        alertMsg,
        from: data.to.replace(data.to.substr(0, 24), "").slice(0, -1),
      });
      res.send({ status: true, data: data.msg });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const sendToUser = async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  data.msg = `${req.files[0].originalname}->${req.files[0].filename}->file`;
  try {
    const support = new Support(data);
    const result = await support.save();
    const alertMsg = "Received new message";
    if (result) {
      await req.app.get("io").emit(data.to, { data, alertMsg });
      res.send({ status: true, data: data.msg });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const sendToSupport = async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  data.msg = `${req.files[0].originalname}->${req.files[0].filename}->file`;
  try {
    const alertMsg = `Received new message from ${data.name}`;
    const support = new Support(data);
    const result = await support.save();
    if (result) {
      await req.app.get("io").emit(data.to, { data, alertMsg });
      res.send({ status: true, data: data.msg });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const sendToSupportPerFile = async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  data.msg = `${req.files[0].originalname}->${req.files[0].filename}->file`;
  try {
    const alertMsg = `Received new message from ${req.body.name}/R-ID: ${req.body.orderId}`;
    const support = new Support(data);
    const result = await support.save();
    if (result) {
      await req.app.get("io").emit(data.to, { data, alertMsg });
      res.send({ status: true, data: data.msg });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const sendToArchive = async (req, res, next) => {
  try {
    const userArray = req.body.filter((s) => {
      if (s.length < 25) return mongoose.Types.ObjectId(s);
    });
    const fileArray = req.body.filter((s) => {
      if (s.length > 25) return s;
    });
    const result1 = await Users.updateMany(
      { _id: { $in: userArray } },
      { $set: { support: false } }
    );
    const result2 = await fileChattingList.updateMany(
      { _id: { $in: fileArray } },
      { $set: { support: false } }
    );

    if (result1 || result2) {
      res.send({ status: true, data: "Move to archive successfully" });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  getSupportID,
  getUserList,
  getChattingHistory,
  updateReadStatus,
  getUserUnreadCount,
  getUserUnreadPerFileCount,
  updateUserReadStatus,
  uploadChatFile,
  sendToUserPerFile,
  sendToUser,
  sendToSupport,
  sendToSupportPerFile,
  sendToArchive,
};
