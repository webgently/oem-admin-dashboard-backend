import { Upload } from "../../models/user/uploadFile";
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

export const uploadFileDataSave = async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data);
    data.fileRename = req.files[0].filename;
    const exist = await Upload.find({});
    if (data.orderId === 0) data.orderId = 1;
    else data.orderId = exist.length + 1;
    const upload = new Upload(data);
    const result = await upload.save();
    const adminMail = `
      <div style="display: flex; justify-content: center">
        <div style="padding: 10vh 14vw;">
          <div style="display: flex; justify-content: center">
            <img src="https://ipfs.io/ipfs/QmeJPsPL6z3583s6piViWoAPAkYWSY6hZeoocq6y7zSnZh" width="75%" />
          </div>
          <div style="border-bottom: 2px solid black;"></div>
          <div style="display: flex; justify-content: start; padding-top: 2vh;">
            <div>
              <h1>Received file(${data.orderId}) from ${data.client}</h1>
              <p style="font-size: 16px;">${data.message}</p>
            </div>
          </div>
          <div style="padding-top: 4vh;"><button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;"><a href="${process.env.SITE_DOMAIN}/admin_upload" style=" color: white;">GO TO CUSTOMER PORTAL</a></button></div>
        </div>
      </div>`;
    const userMail = `
      <div style="display: flex; justify-content: center">
        <div style="padding: 10vh 14vw;">
          <div style="display: flex; justify-content: center">
            <img src="https://ipfs.io/ipfs/QmeJPsPL6z3583s6piViWoAPAkYWSY6hZeoocq6y7zSnZh" width="75%" />
          </div>
          <div style="border-bottom: 2px solid black;"></div>
          <div style="display: flex; justify-content: start; padding-top: 2vh;">
            <div>
              <h1>Thank you for uploading!</h1>
              <div style="font-size: 16px;">
                <p>Dear ${data.client}, thank you for uploading your file to use, we will revert back to you shortly.</p>
                <p>File reference ID: ${data.orderId}</p>
                <p>When we have finished your tuningfile you can download it in our portal.</p>
              </div>
            </div>
          </div>
          <div style="padding-top: 4vh;"><button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;"><a href="${process.env.SITE_DOMAIN}/overview" style=" color: white;">GO TO CUSTOMER PORTAL</a></button></div>
        </div>
      </div>`;
    if (result) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const adminMsg = {
        to: process.env.SUPPORT_EMAIL,
        from: process.env.SENDGRID_DOMAIN, // Use the email address or domain you verified above
        subject: `Received file(${data.orderId}) from: ${data.client}`,
        text: `Received ${data.orderId} from: ${data.client}`,
        html: adminMail,
      };
      const userMsg = {
        to: data.email,
        from: process.env.SENDGRID_DOMAIN, // Use the email address or domain you verified above
        subject: "File Upload!",
        text: `File(${data.orderId}) Uploading!`,
        html: userMail,
      };
      sgMail.send(adminMsg).then(
        () => {},
        (error) => {
          console.error(error);
          if (error.response) {
            console.error(error.response.body);
          }
        }
      );
      sgMail.send(userMsg).then(
        () => {},
        (error) => {
          console.error(error);
          if (error.response) {
            console.error(error.response.body);
          }
        }
      );
      res.send({ status: true, data: "Saved successfully" });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};
