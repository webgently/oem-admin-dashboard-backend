const { Upload } = require("../../models/user/uploadFile");
const { Support } = require("../../models/support");

const getDataByOrderID = async (req, res, next) => {
  try {
    const data = await Upload.find({
      orderId: req.body.order,
      userId: req.body.id,
    });
    if (data) {
      res.send({ status: true, data });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getDataByFilter = async (req, res, next) => {
  try {
    let data;
    if (req.body.filter === "all") {
      data = await Upload.find({
        userId: req.body.id,
      });
    } else {
      data = await Upload.find({
        status: req.body.filter,
        userId: req.body.id,
      });
    }
    const unreadCount = {};
    await data.forEach(async (element) => {
      const unreadmsg = await Support.find({
        $and: [
          { to: req.body.id + element._id + element.orderId },
          { status: false },
        ],
      });
      unreadCount[element._id] = unreadmsg.length;
    });
    await sleep(100);
    if (data) {
      res.send({ status: true, data, unreadCount });
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
  getDataByOrderID,
  getDataByFilter,
};
