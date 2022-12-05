const { Invoice } = require("../../models/user/invoice");
const { Users } = require("../../models/sign");
const { uuid } = require("uuidv4");
const stripe = require("stripe")(process.env.STRIPE_PUBLIC_KEY);
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const buyCredit = async (req, res, next) => {
  try {
    const { token, other, account } = req.body.data;
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
    const userMail = `
      <div style="display: flex; justify-content: center">
        <div style="padding: 10vh 14vw;">
            <h2 style="text-align: center">Receipt from OEMSERVICE</h2>
            <p style="text-align: center">Receipt #: ${other.receipt}</p>
            <div style="display: flex; padding-top: 2vh">
                <div style="flex-direction: column; padding: 0 4vw;">
                    <p style="font-weight: bold">AMOUNT PAID</p>
                    <p>€${other.netAmount}</p>
                </div>
                <div style="flex-direction: column; padding: 0 4vw">
                    <p style="font-weight: bold">DATE PAID</p>
                    <p>${other.date}</p>
                </div>
                <div style="flex-direction: column; padding: 0 4vw">
                    <p style="font-weight: bold">PAYMENT METHOD</p>
                    <p>${other.method}</p>
                </div>
            </div>
            <h4 style="padding: 0 4vw">Customer Details</h4>
            <div style="display: flex; padding: 0 4vw">
                <ul style="list-style-type: none; font-weight: bold; padding-left: 2vw">
                    <li>Name:</li>
                    <li>Email:</li>
                    <li>Contact:</li>
                    <li>VAT Number:</li>
                    <li>Account Status:</li>
                    <li>Region:</li>
                    <li>Country:</li>
                    <li>City:</li>
                    <li>Address:</li>
                    <li>Zip Code:</li>
                </ul>
                <ul style="list-style-type: none;">
                    <li>${account.name}</li>
                    <li>${token.email}</li>
                    <li>${account.phone}</li>
                    <li>${account.vatNumber}</li>
                    <li>${account.status}</li>
                    <li>${account.subcontinent}</li>
                    <li>${account.country}</li>
                    <li>${account.city}</li>
                    <li>${account.address}</li>
                    <li>${account.zcode}</li>
                </ul>
            </div>
            <h4 style="padding: 0 4vw">SUMMARY</h4>
            <div style="padding: 0 10vw">
              <p>
                <span>Bought 100 Credits</span>
                <span style="float: right">€${Number(
                  other.netAmount - other.fee
                )}</span>
              </p>
              <div style="border: 1px solid #80808075"></div>
              <p>
                <span>Handling Fee</span>
                <span style="float: right">€${other.fee}</span>
              </p>
              <div style="border: 1px solid #80808075"></div>
              <p>
                <span>25% VAT Charges</span>
                <span style="float: right">${other.vatCharge}</span>
              </p>
              <div style="border: 1px solid #80808075"></div>
              <p style="font-weight: bold;">
                <span>Amount charged</span>
                <span style="float: right">€${other.netAmount}</span>
              </p>
            </div>
            <div style="border-top: 1px solid gray; border-bottom: 1px solid gray; padding: 2vh 0; margin: 4vh 4vw">
            <div style="text-align: center">
              If you have any questions, contact us at&nbsp;<b>${
                process.env.SUPPORT_EMAIL
              }</b>.
            </div>
          </div>
          <center>You're receiving this email because you made a purchase at OEMSERVICE</center>
        </div>
      </div>`;
    const adminMail = `
      <div style="display: flex; justify-content: center">
        <div style="padding: 10vh 14vw;">
            <h2 style="text-align: center">Receipt from OEMSERVICE</h2>
            <p style="text-align: center">Receipt #: ${other.receipt}</p>
            <div style="display: flex; padding-top: 2vh">
                <div style="flex-direction: column; padding: 0 4vw;">
                    <p style="font-weight: bold">AMOUNT PAID</p>
                    <p>€${other.netAmount}</p>
                </div>
                <div style="flex-direction: column; padding: 0 4vw">
                    <p style="font-weight: bold">DATE PAID</p>
                    <p>${other.date}</p>
                </div>
                <div style="flex-direction: column; padding: 0 4vw">
                    <p style="font-weight: bold">PAYMENT METHOD</p>
                    <p>${other.method}</p>
                </div>
            </div>
            <h4 style="padding: 0 4vw">Customer Details</h4>
            <div style="display: flex; padding: 0 4vw">
                <ul style="list-style-type: none; font-weight: bold; padding-left: 2vw">
                    <li>Name:</li>
                    <li>Email:</li>
                    <li>Contact:</li>
                    <li>VAT Number:</li>
                    <li>Account Status:</li>
                    <li>Region:</li>
                    <li>Country:</li>
                    <li>City:</li>
                    <li>Address:</li>
                    <li>Zip Code:</li>
                </ul>
                <ul style="list-style-type: none;">
                    <li>${account.name}</li>
                    <li>${token.email}</li>
                    <li>${account.phone}</li>
                    <li>${account.vatNumber}</li>
                    <li>${account.status}</li>
                    <li>${account.subcontinent}</li>
                    <li>${account.country}</li>
                    <li>${account.city}</li>
                    <li>${account.address}</li>
                    <li>${account.zcode}</li>
                </ul>
            </div>
            <h4 style="padding: 0 4vw">SUMMARY</h4>
            <div style="padding: 0 10vw">
              <p>
                <span>Bought 100 Credits</span>
                <span style="float: right">€${Number(
                  other.netAmount - other.fee
                )}</span>
              </p>
              <div style="border: 1px solid #80808075"></div>
              <p>
                <span>Handling Fee</span>
                <span style="float: right">€${other.fee}</span>
              </p>
              <div style="border: 1px solid #80808075"></div>
              <p>
                <span>25% VAT Charges</span>
                <span style="float: right">${other.vatCharge}</span>
              </p>
              <div style="border: 1px solid #80808075"></div>
              <p style="font-weight: bold;">
                <span>Amount charged</span>
                <span style="float: right">€${other.netAmount}</span>
              </p>
            </div>
            <div style="border-top: 1px solid gray; border-bottom: 1px solid gray; padding: 2vh 0; margin: 4vh 4vw">
            <div style="text-align: center">
              If you have any questions, contact us at&nbsp;<b>${
                process.env.SUPPORT_EMAIL
              }</b>.
            </div>
          </div>
          <center>You're receiving this email because you made a purchase at OEMSERVICE</center>
        </div>
      </div>`;
    if (result1 && result2) {
      const adminMsg = {
        to: process.env.SUPPORT_EMAIL,
        from: process.env.SENDGRID_DOMAIN, // Use the email address or domain you verified above
        subject: `Received Payment`,
        text: `Received €${other.netAmount} of payment receipt(${other.receipt}) from ${account.name}`,
        html: adminMail,
      };
      const userMsg = {
        to: other.email,
        from: process.env.SENDGRID_DOMAIN, // Use the email address or domain you verified above
        subject: `Payment Receipt`,
        text: `Payment Receipt(${other.receipt})`,
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
      req.app.get("io").emit("creditCheck" + other.userId);
      res.send({ stauts: true });
    } else {
      res.send({ stauts: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllInvoice = async (req, res, next) => {
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

const getOneInvoice = async (req, res, next) => {
  try {
    const result1 = await Invoice.findOne({ _id: req.body.id });
    const result2 = await Users.findOne({ _id: req.body.userId });
    if (result2) {
      res.send({
        status: true,
        result1,
        result2,
        adminMail: process.env.SUPPORT_EMAIL,
      });
    } else {
      res.send({ status: false, data: "Interanal server error" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUserInvoiceHistory = async (req, res, next) => {
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

module.exports = {
  buyCredit,
  getAllInvoice,
  getOneInvoice,
  getUserInvoiceHistory,
};
