const { Users } = require("../models/sign");
const { Privacy } = require("../models/privacy");
const { Daily } = require("../models/daily");
const { Logo } = require("../models/logo");
const { Bg } = require("../models/bg");

const updateProfile = async (req, res, next) => {
  const { _id, name, email, phone, vatNumber, region, country, city, address } =
    req.body;
  await Users.updateOne(
    {
      _id: _id,
    },
    {
      name: name,
      email: email,
      phone: phone,
      vatNumber: vatNumber,
      subcontinent: region,
      country: country,
      city: city,
      address: address,
    }
  );
  const result = await Users.findOne({ _id: req.body._id });
  res.send({ status: true, result });
};

const savePrivacy = async (req, res, next) => {
  const { id, privacyMsg } = req.body;
  await Privacy.updateOne(
    {
      _id: id,
    },
    { privacy: privacyMsg }
  );
  res.send({ status: true });
};

const getPrivacy = async (req, res, next) => {
  const data = await Privacy.findOne({});
  if (data) {
    res.send({ status: false, _id: data._id, privacy: data.privacy });
  } else {
    const privacy = new Privacy({ privacy: "" });
    const db = await privacy.save();
    res.send({ status: false, _id: db._id, privacy: db.privacy });
  }
};

const changePassword = async (req, res, next) => {
  const { _id, oldPassword, newPassword } = req.body;
  const data = await Users.findOne({ _id: req.body._id });
  if (data.password === oldPassword) {
    await Users.updateOne(
      {
        _id: _id,
      },
      { password: newPassword }
    );
    const result = await Users.findOne({ _id: _id });
    res.send({ status: true, result });
  } else {
    res.send({ status: false });
  }
};

const getAllDaily = async (req, res, next) => {
  try {
    const data = await Daily.find({});
    if (data.length > 0) {
      const table = await Daily.find({});
      res.send({ status: true, table });
    } else {
      const data = [
        { day: "Monday", open: "--:--:--", close: "--:--:--", holyday: true },
        { day: "Tuesday", open: "--:--:--", close: "--:--:--", holyday: true },
        {
          day: "Wednesday",
          open: "--:--:--",
          close: "--:--:--",
          holyday: true,
        },
        { day: "Thursday", open: "--:--:--", close: "--:--:--", holyday: true },
        { day: "Friday", open: "--:--:--", close: "--:--:--", holyday: true },
        { day: "Saturday", open: "--:--:--", close: "--:--:--", holyday: true },
        { day: "Sunday", open: "--:--:--", close: "--:--:--", holyday: true },
      ];
      const table = await Daily.insertMany(data);
      res.send({ status: true, table });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateDaily = async (req, res, next) => {
  const { id, holyDay, openTime, closeTime } = req.body.data;
  if (holyDay) {
    await Daily.updateOne(
      {
        _id: id,
      },
      { holyday: holyDay, open: "--:--:--", close: "--:--:--" }
    );
  } else {
    await Daily.updateOne(
      {
        _id: id,
      },
      { holyday: holyDay, open: openTime, close: closeTime }
    );
  }

  const result = await Daily.find();
  res.send({ status: true, result });
};

const getOneDaily = async (req, res, next) => {
  const data = await Daily.findOne({ _id: req.body.id });
  res.send({ status: true, data });
};

const uploadAvatar = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};

const uploadAvatarDataSave = async (req, res, next) => {
  const userId = JSON.parse(req.body.userId);
  const result = await Users.updateOne(
    {
      _id: userId,
    },
    { profile: req.files[0].filename }
  );
  if (result) {
    return res.send({ status: true, data: "logo/" + req.files[0].filename });
  } else {
    return res.send({ status: false, data: "Internal server error" });
  }
};

const uploadBg = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};

const uploadBgDataSave = async (req, res, next) => {
  const exist = await Bg.findOne({});
  let result;
  if (exist) {
    result = await Bg.updateOne(
      {
        _id: exist._id,
      },
      {
        name: req.files[0].originalname,
        size: req.files[0].size,
        type: req.files[0].mimetype,
        rename: req.files[0].filename,
      }
    );
  } else {
    const data = {
      name: req.files[0].originalname,
      size: req.files[0].size,
      type: req.files[0].mimetype,
      rename: req.files[0].filename,
    };
    const newBg = new Bg(data);
    result = await newBg.save();
  }
  if (result) {
    return res.send({ status: true, data: "logo/" + req.files[0].filename });
  } else {
    return res.send({ status: false, data: "Internal server error" });
  }
};

const uploadLogo = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};

const uploadDataSave = async (req, res, next) => {
  const check = await Privacy.findOne({});
  const data = JSON.parse(req.body.data);
  data.rename = req.files[0].filename;
  if (check) {
    await Logo.remove({});
  }
  const logo = new Logo(data);
  const result = await logo.save();
  if (result) {
    return res.send({ status: true, data: "logo/" + result.rename });
  } else {
    return res.send({ status: false, data: "Internal server error" });
  }
};

const getLogo = async (req, res, next) => {
  const result = await Logo.findOne({});
  if (result) {
    return res.send({ status: true, data: "logo/" + result.rename });
  } else {
    return res.send({ status: false, data: "Internal server error" });
  }
};

const getAvatar = async (req, res, next) => {
  const result = await Users.findOne({ _id: req.body.userId });
  if (result) {
    return res.send({ status: true, data: "logo/" + result.profile });
  } else {
    return res.send({ status: false, data: "Internal server error" });
  }
};

const getBg = async (req, res, next) => {
  const result = await Bg.findOne({});
  if (result) {
    return res.send({ status: true, data: "logo/" + result.rename });
  } else {
    return res.send({ status: false, data: "Internal server error" });
  }
};

module.exports = {
  updateProfile,
  savePrivacy,
  getPrivacy,
  changePassword,
  getAllDaily,
  updateDaily,
  getOneDaily,
  uploadAvatar,
  uploadAvatarDataSave,
  uploadBg,
  uploadBgDataSave,
  uploadLogo,
  uploadDataSave,
  getLogo,
  getAvatar,
  getBg,
};
