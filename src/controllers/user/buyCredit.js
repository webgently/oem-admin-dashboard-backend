import { Invoice } from "../../models/user/invoice";
import { Users } from "../../models/sign";
const stripe = require("stripe")("sk_test_wU7nrJCZspk1NPDxiQgAF05q");
const { uuid } = require("uuidv4");

export const buyCredit = async (req, res, next) => {
  try {
    const { token, other } = req.body.data;
    // const customer = await stripe.customers.create({
    //   email: token.email,
    //   source: token.id,
    // });
    // const idempotency_key = uuid();
    // const charge = await stripe.charges.create(
    //   {
    //     amount: other.netAmount * 100,
    //     currency: "eur",
    //     customer: customer.id,
    //     receipt_email: token.email,
    //     description: `Purchased the ${product.name}`,
    //     shipping: {
    //       name: token.card.name,
    //       address: {
    //         line1: token.card.address_line1,
    //         line2: token.card.address_line2,
    //         city: token.card.address_city,
    //         country: token.card.address_country,
    //         postal_code: token.card.address_zip,
    //       },
    //     },
    //   },
    //   {
    //     idempotency_key,
    //   }
    // );
    const exist = await Invoice.find({});
    other.receipt = exist.length + 1;
    other.method = token.card.brand + "-" + token.card.last4;
    const invoice = new Invoice(other);
    const getUserData = await Users.findOne({ _id: other.userId });
    const sumCredit = Number(getUserData.credit) + Number(other.credits);
    const result1 = await invoice.save();
    const result2 = await Users.updateOne(
      {
        _id: other.userId,
      },
      { credit: sumCredit }
    );
    if (result1 && result2) {
      res.send({ stauts: true });
    } else {
      res.send({ stauts: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllInvoice = async (req, res, next) => {
  try {
    const result = await Invoice.find({});
    if (result) {
      res.send({ stauts: true, data: result });
    } else {
      res.send({ stauts: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getOneInvoice = async (req, res, next) => {
  try {
    const result1 = await Invoice.findOne({ _id: req.body.id });
    const result2 = await Users.findOne({ _id: req.body.userId });
    if (result2) {
      res.send({ status: true, result1, result2 });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getUserInvoiceHistory = async (req, res, next) => {
  try {
    const result = await Invoice.find({ userId: req.body.id });
    if (result) {
      res.send({ status: true, data: result });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};
