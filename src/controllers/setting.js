import { Users } from "../models/sign";
import { Privacy } from "../models/privacy";
import { Daily } from "../models/daily";
import { Logo } from "../models/logo";

export const updateProfile = async (req, res, next) => {
  const {
    _id,
    name,
    email,
    contact,
    vatNumber,
    region,
    country,
    city,
    address,
  } = req.body;
  await Users.updateOne(
    {
      _id: _id,
    },
    {
      name: name,
      email: email,
      phone: contact,
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

export const savePrivacy = async (req, res, next) => {
  const { id, privacyMsg } = req.body;
  await Privacy.updateOne(
    {
      _id: id,
    },
    { privacy: privacyMsg }
  );
  res.send({ status: true });
};

export const getPrivacy = async (req, res, next) => {
  const data = await Privacy.findOne({});
  if (data) {
    res.send({ status: false, _id: data._id, privacy: data.privacy });
  } else {
    const privacy = new Privacy({ privacy: "" });
    const db = await privacy.save();
    res.send({ status: false, _id: db._id, privacy: db.privacy });
  }
};

export const changePassword = async (req, res, next) => {
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

export const getAllDaily = async (req, res, next) => {
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

export const updateDaily = async (req, res, next) => {
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

export const getOneDaily = async (req, res, next) => {
  const data = await Daily.findOne({ _id: req.body.id });
  res.send({ status: true, data });
};

export const uploadAvatar = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};

export const uploadAvatarDataSave = async (req, res, next) => {
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

export const uploadLogo = async (req, res, next) => {
  let d = req.files;
  let row = {};
  for (let i in d) {
    row[d[i].fieldname] = d[i].filename;
  }
  req.images = row;
  next();
};

export const uploadDataSave = async (req, res, next) => {
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

export const getLogo = async (req, res, next) => {
  const result = await Logo.findOne({});
  if (result) {
    return res.send({ status: true, data: "logo/" + result.rename });
  } else {
    return res.send({ status: false, data: "Internal server error" });
  }
};

export const getAvatar = async (req, res, next) => {
  const result = await Users.findOne({ _id: req.body.userId });
  if (result) {
    return res.send({ status: true, data: "logo/" + result.profile });
  } else {
    return res.send({ status: false, data: "Internal server error" });
  }
};
