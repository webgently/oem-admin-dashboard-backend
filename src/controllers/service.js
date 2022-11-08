import { Service } from "../models/service";

export const addService = async (req, res, next) => {
    let serviceData = req.body.data;
    serviceData.status = 'Active';
    const newService = new Service(serviceData);
    const result = await newService.save();
    if (!result) {
      return res.send({stauts: false, data: "Interanal server error"});
    } else {
      res.send({stauts: true, data: result});
    }
};

export const updateService = async (req, res, next) => {
    const {_id, serviceType} = req.body.data;
    await Service.updateOne(
        {
        _id: _id,
        },
        { serviceType: serviceType }
    );
    res.send("success");
};

export const getAllService = async (req, res, next) => {
    const result = await Service.find({});
    res.send(result);
};

export const getOneService = async (req, res, next) => {
    const service = await Service.findOne({ _id: req.body._id });
    if (service) {
        res.send(service);
    } 
};

export const deleteService = async (req, res, next) => {
    await Service.remove({ _id: req.body._id });
    res.send("success");
};
