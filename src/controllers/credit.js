import { Credits } from "../models/credit";
import { Fee } from "../models/fee";

export const createCredit = async (req, res, next) => {
    const newCredit = new Credits(req.body.data);
    const result = await newCredit.save();
    if (!result) {
      return res.send({stauts: false, data: "Interanal server error"});
    } else {
      res.send({stauts: true, data: result});
    }
};

export const updateCredit = async (req, res, next) => {
    const {_id, credit, price} = req.body.data;
    await Credits.updateOne(
        {
            _id: _id,
        },
        { credit: credit, price: price}
    );
    res.send("success");
};

export const deleteCredit = async (req, res, next) => {
    await Credits.remove({ _id: req.body._id });
    res.send("success");
};

export const getAllCredit = async (req, res, next) => {
    const result = await Credits.find({});
    res.send(result);
};

export const getOneCredit = async (req, res, next) => {
    const credit = await Credits.findOne({ _id: req.body._id });
    if (credit) {
        res.send(credit);
    } 
};

export const updateFee = async (req, res, next) => {
    const {id, handleFee} = req.body;
    await Fee.updateOne(
        {
            _id: id,
        },
        { fee: handleFee}
    );
    res.send({status: true})
};

export const getFee = async (req, res, next) => {
    const data = await Fee.findOne({});
    if(data) {
        res.send({status: false, _id: data._id, fee: data.fee});
    } else {
        const fee = new Fee({fee: 0});
        const db = await fee.save();
        res.send({status: false, _id: db._id, fee: db.fee });
    }
};