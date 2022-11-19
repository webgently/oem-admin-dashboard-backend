import { Users } from "../models/sign";
import { Support } from "../models/support";

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
    const userList = await Users.find({ _id: { $not: { $lte: req.body.id } } });
    const unreadCount = {};

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
    const support = await Support.find({
      $or: [{ from: req.body.id }, { to: req.body.id }],
    });
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
