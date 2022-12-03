const { Upload } = require("../../models/user/uploadFile");
const { CreditHistory } = require("../../models/user/creditHistory");
const { Users } = require("../../models/sign");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

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
    const result1 = await Upload.findOne({ _id: req.body.id });
    const result2 = await Users.findOne({ _id: result1.userId });
    const result3 = await CreditHistory.findOne({
      userId: result1.userId,
      orderId: result1.orderId,
    });
    let charged = 0;
    if (result3) charged = result3.credit;
    if (result1 && result2) {
      res.send({
        status: true,
        data: result1,
        available: result2.credit,
        charged,
      });
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
        readStatus: true,
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
    let user = await Users.findOne({ _id: data.userId });
    let result2;
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
    const userMail = `
      <div style="display: flex; justify-content: center">
        <div style="padding: 10vh 14vw;">
          <div style="display: flex; justify-content: center">
            <img src="https://ipfs.io/ipfs/QmeJPsPL6z3583s6piViWoAPAkYWSY6hZeoocq6y7zSnZh" width="75%" />
          </div>
          <div style="border-bottom: 2px solid black;"></div>
          <div style="display: flex; justify-content: start; padding-top: 2vh;">
            <div>
              <h1>Your file is ready!</h1>
              <div style="font-size: 16px;">
                <p>Dear ${user.name}, your uploaded file(id: ${data.orderId}) has been completed and is ready for installation.</p>
                <p>Please be careful when writing files to ECUs! 
                  As a profestional tuner, we expect you to have confidence, knowledge and experience in doing this kind of work.
                </p>
                <p>Thank you for your trust in our services and we hope to see you again soon!</p>
              </div>
            </div>
          </div>
          <div style="padding-top: 4vh;"><button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;"><a href="${process.env.SITE_DOMAIN}/overview" style=" color: white;">GO TO CUSTOMER PORTAL</a></button></div>
        </div>
      </div>`;
    const userMsg = {
      to: user.email,
      from: process.env.SENDGRID_DOMAIN, // Use the email address or domain you verified above
      subject: "File Ready!",
      text: `File(${data.orderId}) Uploading!`,
      html: userMail,
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgMail.send(userMsg).then(
      () => {},
      (error) => {
        console.error(error);
        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
    res.send({ status: true, data: "Uploaded successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const uploadStatusSave = async (req, res, next) => {
  try {
    const data = req.body.data;
    if (data.status === "cancelled") {
      let user = await Users.findOne({ _id: data.userId });
      await CreditHistory.updateOne(
        { orderId: data.orderId, userId: data.userId },
        {
          credit: 0,
        }
      );
      const updataCredit = user.credit + data.credit;
      await Users.updateOne({ _id: data.userId }, { credit: updataCredit });
      const userMail = `
        <div style="display: flex; justify-content: center">
          <div style="padding: 10vh 14vw;">
            <div style="display: flex; justify-content: center">
              <img src="https://ipfs.io/ipfs/QmeJPsPL6z3583s6piViWoAPAkYWSY6hZeoocq6y7zSnZh" width="75%" />
            </div>
            <div style="border-bottom: 2px solid black;"></div>
            <div style="display: flex; justify-content: start; padding-top: 2vh;">
              <div>
                <h1>Your file is cancel!</h1>
                <div style="font-size: 16px;">
                  <p>Dear ${user.name}, your uploaded file(id: ${data.orderId}) has been cancelled and is ready for installation.</p>
                </div>
              </div>
            </div>
            <div style="padding-top: 4vh;"><button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;"><a href="${process.env.SITE_DOMAIN}/overview" style=" color: white;">GO TO CUSTOMER PORTAL</a></button></div>
          </div>
        </div>`;
      const userMsg = {
        to: data.email,
        from: process.env.SENDGRID_DOMAIN, // Use the email address or domain you verified above
        subject: "File Cancelled!",
        text: `File(${data.orderId}) Cancelled!`,
        html: userMail,
      };
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      sgMail.send(userMsg).then(
        () => {},
        (error) => {
          console.error(error);
          if (error.response) {
            console.error(error.response.body);
          }
        }
      );
    }
    await Upload.updateOne(
      { _id: data.id },
      {
        status: data.status,
        note: data.note,
        readStatus: true,
      }
    );
    res.send({ status: true, data: "Status updated successfully" });
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
        readStatus: true,
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
