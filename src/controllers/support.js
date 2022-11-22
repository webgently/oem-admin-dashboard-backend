import { Users } from "../models/sign";
import { Support } from "../models/support";
import { fileChattingList } from "../models/user/fileChattingList";

export const getSupportID = async (req, res, next) => {
  try {
    const admin = await Users.findOne({ permission: "admin" });
    res.send({ status: true, data: admin._id });
  } catch (error) {
    console.log(error);
  }
};

export const getUserList = async (req, res, next) => {
  try {
    const list = await Users.find(
      { _id: { $not: { $lte: req.body.id } } },
      { _id: 1, name: 1, profile: 1 }
    );
    const unreadCount = {};
    const fileList = await fileChattingList.find(
      {},
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

export const getChattingHistory = async (req, res, next) => {
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

export const updateReadStatus = async (req, res, next) => {
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

export const getUserUnreadCount = async (req, res, next) => {
  try {
    const data = await Support.find({
      $and: [{ to: req.body.id }, { status: false }],
    });
    res.send({ status: true, unreadCount: data.length });
  } catch (error) {
    console.log(error);
  }
};

export const getUserUnreadPerFileCount = async (req, res, next) => {
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

export const updateUserReadStatus = async (req, res, next) => {
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

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
