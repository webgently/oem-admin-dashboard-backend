const { Upload } = require("../../models/user/uploadFile");
const Mailjet = require('node-mailjet');
require("dotenv").config();
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
);
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const uploadFileDataSave = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    data.fileRename = req.files[0].filename;
    const exist = await Upload.find({});
    if (data.orderId === 0) data.orderId = 1;
    else data.orderId = exist.length + 1;
    const upload = new Upload(data);
    const result = await upload.save();

    
    const userMail = `
      <div style="padding: 10vh 14vw;">
        <div style="text-align: center;">
          <img src="https://ipfs.io/ipfs/Qmbe4x6BizKws5BbNRuLxZrP14vhDVgbNRHhBL68amnB5Z" width="75%" />
        </div>
        <h1 style="text-align: center; padding-top: 1vh">Thank you for uploading!</h1>
        <div>
          <div style="font-size: 16px;">
            <p>Dear ${data.client}, thank you for uploading your file to us.</p>
            <p>We will get back to you soon.</p>
            <p>File reference code: ${data.orderId}</p>
            <p>Do you have questions about your uploaded file? Please use the support function under ”Files Overview” and corresponding
            order id.</p>
            <p>When we have finished your requested file, it is directly available for download at the portal. Make sure you have
            sufficient amount of credits for the service on your accont to be able to recive the updated file</p>
          </div>
        </div>
          <div style="padding-top: 4vh;">
            <button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;">
              <a href="${process.env.SITE_DOMAIN}/overview" style=" color: white; text-decoration: none;">GO TO CUSTOMER PORTAL</a>
            </button>
          </div>
        <p>Stage 1 and most common DPF/EGR off files have an average delivery time of 20 minutes. For stages 2 and 3 and special
          DPF/EGR off files the estimated delivery time differs per file.</p>
      </div>`;
    const adminMail = `
      <div style="padding: 10vh 14vw;">
        <div style="text-align: center;">
          <img src="https://ipfs.io/ipfs/Qmbe4x6BizKws5BbNRuLxZrP14vhDVgbNRHhBL68amnB5Z" width="75%" />
        </div>
        <h1 style="text-align: center; padding-top: 1vh">Received file(${data.orderId}) from ${data.client}</h1>
        <p style="font-size: 16px;">${data.message}</p>
        <div style="padding-top: 4vh;">
          <button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;">
            <a href="${process.env.SITE_DOMAIN}/admin_upload" style=" color: white; text-decoration: none;">GO TO CUSTOMERPORTAL</a>
          </button>
        </div>
      </div>`;
    
    if (result) {
      const adminSetting = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.EMAIL_DOMAIN,
              Name: "OEMSERVICE"
            },
            To: [
              {
                Email: process.env.SUPPORT_EMAIL,
                Name: data.client
              }
            ],
            Subject: `Received file(${data.orderId}) from: ${data.client}`,
            TextPart: `Received ${data.orderId} from: ${data.client}`,
            HTMLPart: adminMail,
          }
        ]
      })
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
                Email: data.email,
                Name: data.client
              }
            ],
            Subject: "File Upload!",
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
      adminSetting.then((result) => {
        console.log(result.body)
      })
      .catch((err) => {
        console.log(err.statusCode)
      })

      // const adminMsg = {
      //   to: process.env.SUPPORT_EMAIL,
      //   from: process.env.EMAIL_DOMAIN, // Use the email address or domain you verified above
      //   subject: `Received file(${data.orderId}) from: ${data.client}`,
      //   text: `Received ${data.orderId} from: ${data.client}`,
      //   html: adminMail,
      // };
      // const userMsg = {
      //   to: data.email,
      //   from: process.env.EMAIL_DOMAIN, // Use the email address or domain you verified above
      //   subject: "File Upload!",
      //   text: `File(${data.orderId}) Uploading!`,
      //   html: userMail,
      // };
      // sgMail.send(adminMsg).then(
      //   () => {},
      //   (error) => {
      //     console.error(error);
      //     if (error.response) {
      //       console.error(error.response.body);
      //     }
      //   }
      // );
      // sgMail.send(userMsg).then(
      //   () => {},
      //   (error) => {
      //     console.error(error);
      //     if (error.response) {
      //       console.error(error.response.body);
      //     }
      //   }
      // );
      res.send({ status: true, data: "Saved successfully" });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const uploadFile = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  uploadFileDataSave,
  uploadFile,
};
