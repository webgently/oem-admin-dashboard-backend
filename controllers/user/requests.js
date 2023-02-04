const { Upload } = require("../../models/user/uploadFile");
const { CreditHistory } = require("../../models/user/creditHistory");
const { Users } = require("../../models/sign");
const Mailjet = require('node-mailjet');
// const sgMail = require("@sendgrid/mail");
require("dotenv").config();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
);

const getRequests = async (req, res, next) => {
  try {
    const data = await Upload.find({}).sort({ "orderId": -1 });
    if (data) {
      res.send({ status: true, data });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getOneRequest = async (req, res, next) => {
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

const updateUpload = async (req, res, next) => {
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

const uploadUploadDataSave = async (req, res, next) => {
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
      <div style="padding: 10vh 14vw;">
        <div style="text-align: center;">
            <img src="https://ipfs.io/ipfs/Qmbe4x6BizKws5BbNRuLxZrP14vhDVgbNRHhBL68amnB5Z" width="75%" />
        </div>
        <h1 style="text-align: center;">Your file is ready!</h1>
        <div style="font-size: 16px; padding-top: 1vh;">
          <p>Dear ${user.name}, your uploaded file(id: ${data.orderId}) has been completed and its ready for download</p>
          <p>Let us know if there is any questions regarding the file by using the support button under ”files overview” and the
          corresponding ID.
          </p>
        </div>
        <div style="padding-top: 4vh;">
          <button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;">
            <a href="${process.env.SITE_DOMAIN}/overview" style=" color: white; text-decoration: none;">GO TO CUSTOMER PORTAL</a>
          </button>
        </div>
        <p>Do you want free credits?
        Send us your dyno result , your video of test driving, pop&bangs or other cool stuff related to our file service!</p>
      </div>`;
    const userSetting = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_DOMAIN,
            Name: `${process.env.SUPPORT_NAME} of OEMSERVICE`
          },
          To: [
            {
              Email: user.email,
              Name: user.name
            }
          ],
          Subject: "File Ready!",
          TextPart: `File(${data.orderId}) Uploading!`,
          HTMLPart: userMail,
        }
      ]
    })
    userSetting.then((result) => {
      console.log(result.body)
    })
    .catch((err) => {
      console.log(err.statusCode)
    })
    // const userMsg = {
    //   to: user.email,
    //   from: process.env.EMAIL_DOMAIN, // Use the email address or domain you verified above
    //   subject: "File Ready!",
    //   text: `File(${data.orderId}) Uploading!`,
    //   html: userMail,
    // };
    // sgMail.send(userMsg).then(
    //   () => {},
    //   (error) => {
    //     console.error(error);
    //     if (error.response) {
    //       console.error(error.response.body);
    //     }
    //   }
    // );
    res.send({ status: true, data: "Uploaded successfully" });
  } catch (error) {
    console.log(error);
  }
};

const uploadStatusSave = async (req, res, next) => {
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
        <div style="padding: 10vh 14vw;">
          <div style="text-align: center;">
            <img src="https://ipfs.io/ipfs/Qmbe4x6BizKws5BbNRuLxZrP14vhDVgbNRHhBL68amnB5Z" width="75%" />
          </div>
          <h1 style="text-align: center;">Unfortunately, your file cannot be processed!</h1>
          <div style="font-size: 16px; padding-top: 1vh;">
            <p>Dear ${user.name}, Your uploaded file(id: ${data.orderId}) is unfortunately not possible to process.</p>
            <p>We cannot handle the file you have uploaded on our portal. Unfortunately, the reason can be many and we recommend that
            you use the support button under "file overview" and the corresponding ID to get answers regarding your particular file.
            No credits have been taken from your account.</p>
          </div>
          <div style="padding-top: 4vh;">
            <button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;">
              <a href="${process.env.SITE_DOMAIN}/overview" style=" color: white; text-decoration: none;">GO TO CUSTOMER PORTAL</a>
            </button>
          </div>
          <p style="font-weight: bold; padding-top: 1vh;">F.A.Q</p>
          <p>Why couldn't you handle my uploaded file?</p>
          <p>• The file format is wrong (we handle .bin, .org, .zip, .rar, .bdc, .tun and various slave formats)</p>
          <p>• Slave file that is linked to a different master than OEM service</p>
          <p>• The file is not original / already modified (always attach original together with what you upload)</p>
          <p>• We do not offer the service requested</p>
        </div>`;
      const userSetting = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_DOMAIN,
              Name: `${process.env.SUPPORT_NAME} of OEMSERVICE`
            },
            To: [
              {
                Email: user.email,
                Name: user.name
              }
            ],
            Subject: "File Cancelled!",
            TextPart: `File(${data.orderId}) Cancelled!`,
            HTMLPart: userMail,
          }
        ]
      })
      userSetting.then((result) => {
        console.log(result.body)
      })
      .catch((err) => {
        console.log(err.statusCode)
      })
      // const userMsg = {
      //   to: user.email,
      //   from: process.env.EMAIL_DOMAIN, // Use the email address or domain you verified above
      //   subject: "File Cancelled!",
      //   text: `File(${data.orderId}) Cancelled!`,
      //   html: userMail,
      // };
      // sgMail.send(userMsg).then(
      //   () => {},
      //   (error) => {
      //     console.error(error);
      //     if (error.response) {
      //       console.error(error.response.body);
      //     }
      //   }
      // );
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

const changeStatus = async (req, res, next) => {
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

const setRequestStatus = async (req, res, next) => {
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

module.exports = {
  getRequests,
  getOneRequest,
  updateUpload,
  uploadUploadDataSave,
  uploadStatusSave,
  changeStatus,
  setRequestStatus,
};
