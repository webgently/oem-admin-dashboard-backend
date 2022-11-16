import { Upload } from "../../models/user/uploadFile";
import { CreditHistory } from "../../models/user/creditHistory";
import { Users } from "../../models/sign";

export const getRequests = async (req, res, next) => {
  try {
    const data = await Upload.find({});
    if (data) {
      res.send({ status: true, data });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getOneRequest = async (req, res, next) => {
  try {
    const data = await Upload.find({ _id: req.body.id });
    if (data) {
      res.send({ status: true, data });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUpload = async (req, res, next) => {
  try {
    let d = req.files;
    let row = {};
    for (let i in d) {
      row[d[i].fieldname] = d[i].filename;
    }
    req.images = row;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const uploadUploadDataSave = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    const result1 = await Upload.updateOne(
      { _id: data.id },
      {
        $push: {
          fileName: req.files[0].originalname,
          fileSize: req.files[0].size,
          fileType: req.files[0].mimetype,
          fileRename: req.files[0].filename,
        },
        status: data.status,
        note: data.note,
      }
    );

    const credit = {
      userId: data.userId,
      orderId: data.orderId,
      credit: data.credit,
      date: data.date,
    };

    const exist = await CreditHistory.findOne({
      orderId: data.orderId,
      userId: data.userId,
    });

    let result2;
    let user = await Users.findOne({ _id: data.userId });
    if (exist) {
      const updataCredit = user.credit + exist.credit - data.credit;
      await Users.updateOne({ _id: data.userId }, { credit: updataCredit });
      await CreditHistory.updateOne(
        {
          orderId: data.orderId,
        },
        {
          credit: data.credit,
          date: data.date,
        }
      );
    } else {
      const updataCredit = user.credit - data.credit;
      await Users.updateOne({ _id: data.userId }, { credit: updataCredit });
      const d = new CreditHistory(credit);
      result2 = d.save();
    }
    res.send({ status: true, data: "Uploaded successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const result = await Upload.updateOne(
      { _id: req.body.id },
      {
        status: "in-progress",
      }
    );
    if (result) {
      res.send({ status: true, data: "Uploaded successfully" });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const setRequestStatus = async (req, res, next) => {
  try {
    const result = await Upload.updateMany(
      { readStatus: false },
      {
        readStatus: true,
      }
    );
    if (result) {
      res.send({ status: true });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};
