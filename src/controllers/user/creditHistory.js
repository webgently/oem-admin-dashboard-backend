const { CreditHistory } = require("../../models/user/creditHistory");

export const getCreditHistory = async (req, res, next) => {
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

export const getCreditByOrderID = async (req, res, next) => {
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
