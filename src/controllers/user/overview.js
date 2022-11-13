import { Upload } from "../../models/user/uploadFile";

export const getDataByOrderID = async (req, res, next) => {
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

export const getDataByFilter = async (req, res, next) => {
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
    if (data) {
      res.send({ status: true, data });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};
