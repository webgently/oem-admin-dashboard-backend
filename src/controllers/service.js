const { Service } = require("../models/service");

const addService = async (req, res, next) => {
  let serviceData = req.body.data;
  serviceData.status = "Active";
  const newService = new Service(serviceData);
  const result = await newService.save();
  if (!result) {
    return res.send({ stauts: false, data: "Interanal server error" });
  } else {
    res.send({ stauts: true, data: result });
  }
};

const updateService = async (req, res, next) => {
  const { _id, serviceType } = req.body.data;
  await Service.updateOne(
    {
      _id: _id,
    },
    { serviceType: serviceType }
  );
  res.send("success");
};

const getAllService = async (req, res, next) => {
  const result = await Service.find({});
  res.send(result);
};

const getOneService = async (req, res, next) => {
  const service = await Service.findOne({ _id: req.body._id });
  if (service) {
    res.send(service);
  }
};

const deleteService = async (req, res, next) => {
  await Service.remove({ _id: req.body._id });
  res.send("success");
};

module.exports = {
  addService,
  updateService,
  getAllService,
  getOneService,
  deleteService,
};
