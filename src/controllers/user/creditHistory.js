const { CreditHistory } = require("../../models/user/creditHistory");

const getCreditHistory = async (req, res, next) => {
  try {
    const result = await CreditHistory.find({ userId: req.body.id });
    if (result) {
      res.send({ status: true, data: result });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getCreditByOrderID = async (req, res, next) => {
  try {
    const data = await CreditHistory.find({
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

module.exports = { getCreditHistory, getCreditByOrderID };
