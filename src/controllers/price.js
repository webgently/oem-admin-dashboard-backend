const { Prices } = require("../models/price");
const { Service } = require("../models/service");

export const getServiceType = async (req, res, next) => {
  const result = await Service.find({});
  res.send(result);
};

export const addPrice = async (req, res, next) => {
  let priceData = req.body.data;
  const newPrice = new Prices(priceData);
  const result = await newPrice.save();
  if (!result) {
    return res.send({ stauts: false, data: "Interanal server error" });
  } else {
    res.send({ stauts: true, data: result });
  }
};

export const updatePrice = async (req, res, next) => {
  const { _id, serviceType, service, credit } = req.body.data;
  await Prices.updateOne(
    {
      _id: _id,
    },
    { serviceType: serviceType, service: service, credit: credit }
  );
  res.send("success");
};

export const deletePrice = async (req, res, next) => {
  await Prices.remove({ _id: req.body._id });
  res.send("success");
};

export const getAllPrice = async (req, res, next) => {
  const result = await Prices.find({});
  res.send(result);
};

export const getOnePrice = async (req, res, next) => {
  const price = await Prices.findOne({ _id: req.body._id });
  if (price) {
    res.send(price);
  }
};
