const { Users } = require("../models/sign");
const { Forgot } = require("../models/forgot");
const { v4: uuid } = require("uuid");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signup = async (req, res, next) => {
  let userData = req.body.data;
  userData.permission = "user";
  userData.note = "";
  userData.date = new Date();
  userData.credit = "0";
  userData.status = "in-active";
  userData.profile = "";
  userData.support = true;
  userData.tax = 0;
  const user = await Users.findOne({ email: userData.email });
  if (!user) {
    const newUser = new Users(userData);
    const result = await newUser.save();
    if (!result) {
      return res.json({ status: false, data: "Interanal server error" });
    } else {
      return res.json({ status: true, data: result });
    }
  } else {
    return res.json({ status: true, data: "already exist" });
  }
};

const signin = async (req, res, next) => {
  const { mail, pass } = req.body.data;
  const user = await Users.findOne({ email: mail });
  if (user !== null) {
    if (user.password === pass) {
      if (user.status === "active") {
        res.send({ login: true, data: user });
      } else {
        res.send({
          login: false,
          data: "You have to receive allow from admin",
        });
      }
    } else {
      res.send({ login: false, data: "Password Incorrect!" });
    }
  } else {
    res.send({ login: false, data: "This email is not exist!" });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await Users.findOne({ email: req.body.email });
    if (result) {
      let data = {};
      const idempotency_key = uuid();
      data.email = req.body.email;
      data.link = `${process.env.SITE_DOMAIN}/reset-password/${req.body.email}/${idempotency_key}`;
      data.sendDate = new Date().valueOf();
      const exist = await Forgot.findOne({ email: req.body.email });
      let flag;
      if (exist) {
        flag = await Forgot.updateOne(
          { email: data.email },
          {
            link: data.link,
            sendDate: data.sendDate,
          }
        );
      } else {
        const resetLink = new Forgot(data);
        flag = await resetLink.save();
      }

      if (flag) {
        const userMail = `
          <div style="display: flex; justify-content: center">
            <div style="padding: 10vh 14vw;">
                <div style="text-align: center;">
                    <img src="https://ipfs.io/ipfs/Qmbe4x6BizKws5BbNRuLxZrP14vhDVgbNRHhBL68amnB5Z" width="75%" />
                </div>
                <div style="text-align: center; padding-top: 2vh;">
                    <h1>Forgot your password?</h1>
                </div>
                <div style="font-size: 16px; text-align: center;">
                    <p>You have requested a new password, use the link below and reset it now.</p>
                </div>
                <div style="padding-top: 4vh; text-align: center;">
                    <button style="padding: 10px 20px; background-color: #0a74ed; border: none; border-radius: 4px; cursor: pointer;"><a href="${data.link}" style="color: white; text-decoration: none;">Reset Password</a>
                    </button>
                </div>
            </div>
        </div>`;
        const userMsg = {
          to: data.email,
          from: process.env.EMAIL_DOMAIN, // Use the email address or domain you verified above
          subject: "Reset Password",
          text: `Reset Password(${data.link})`,
          html: userMail,
        };

        sgMail.send(userMsg).then(
          () => {},
          (error) => {
            console.error(error);
            if (error.response) {
              console.error(error.response.body);
            }
          }
        );
        res.send({ status: true, data: result });
      } else {
        res.send({ status: false, data: "Interanal server error" });
      }
    } else {
      res.send({ status: false, data: "Invalid Email" });
    }
  } catch (error) {
    console.log(error);
  }
};

const checkResetLink = async (req, res, next) => {
  try {
    const result = await Forgot.findOne({ link: req.body.link });
    const date = new Date().valueOf();
    if (result) {
      const betWeenDate = (date - result.sendDate) / 1000 / 60;
      if (betWeenDate > 5) {
        res.send({ status: false, data: "Expired your reset link" });
      } else {
        res.send({ status: true, data: "Reset your password" });
      }
    } else {
      res.send({ status: false, data: "no exist your reset link" });
    }
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await Forgot.findOne({ link: req.body.link });
    const date = new Date().valueOf();
    if (result) {
      const betWeenDate = (date - result.sendDate) / 1000 / 60;
      if (betWeenDate > 5) {
        res.send({ status: false, data: "Expired your reset link" });
      } else {
        const change = await Users.updateOne(
          { email: req.body.email },
          { password: req.body.password }
        );
        if (change)
          res.send({ status: true, data: "Reset password successfully" });
        else {
          res.send({ status: false, data: "Interanal server error" });
        }
      }
    } else {
      res.send({ status: false, data: "no exist your reset link" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserData = async (req, res, next) => {
  const result = await Users.find({});
  res.send(result);
};

const updateNote = async (req, res, next) => {
  await Users.updateOne(
    { _id: req.body.data._id },
    { note: req.body.data.note }
  );
  res.send("success");
};

const updatestatus = async (req, res, next) => {
  await Users.updateOne(
    {
      _id: req.body.data._id,
    },
    { status: req.body.data.status }
  );
  res.send("success");
};

const updatetax = async (req, res, next) => {
  await Users.updateOne(
    {
      _id: req.body.data._id,
    },
    { tax: req.body.data.tax }
  );
  res.send("success");
};

const deleteUser = async (req, res, next) => {
  await Users.remove({ _id: req.body._id });
  res.send("success");
};

const addCredit = async (req, res, next) => {
  let credit = await Users.find({ _id: req.body.data._id });
  let updateCredit = Number(credit[0].credit) + Number(req.body.data.credit);
  await Users.updateOne({ _id: req.body.data._id }, { credit: updateCredit });
  res.send("success");
};

const subtractCredit = async (req, res, next) => {
  let credit = await Users.find({ _id: req.body.data._id });
  let updateCredit = Number(credit[0].credit) - Number(req.body.data.credit);
  await Users.updateOne({ _id: req.body.data._id }, { credit: updateCredit });
  res.send("success");
};

module.exports = {
  signup,
  signin,
  forgotPassword,
  checkResetLink,
  resetPassword,
  getUserData,
  updateNote,
  updatestatus,
  updatetax,
  deleteUser,
  addCredit,
  subtractCredit,
};
