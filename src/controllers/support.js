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
    const data = await Users.find({ _id: { $not: { $lte: req.body.id } } });
    res.send({ status: true, data });
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
