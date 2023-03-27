const express = require("express");
const app = express();
const route = express.Router();
const joi = require("joi");
const Orders = require("../models/orders");
const Customers = require("../models/customers");
const Products = require("../models/products");

//Joi order validation Schema
const joiOrderSchema = joi.object({
  customer: joi.string().required(),
  products: joi
    .array()
    .items(
      joi.object({
        product: joi.string().required(),
        quantity: joi.number().required(),
      })
    )
    .min(1)
    .required(),
  deliveryAddress: joi.string().required(),
});

//=========Joi get order validation Schema===========
const joiGetOrder = joi.object({
  customer: joi.string().required(),
  //customer: joi.string().required(),
});

const joiGetIdOrder = joi.object({
  id: joi.string().required(),
});
//======JOI UPDATE API
const joiOrderUpdate = joi.object({
  id: joi.string().required(),
  status: joi.string().required(),
});

//===========JOI ORDER API=============
route.post("/", async (req, res) => {
  try {
    const { customer, products, deliveryAddress } = req.body;
    console.log(req);
    const { error } = joiOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).send("invalid order request");
    }
    // CUSTOMER VALIDATION
    const checkCus = await Customers.findById(customer);
    if (!checkCus) {
      return res.status(404).json({ message: "Customer Not Found", success: false });
    }
    //PRODUCT VALIDATION
    const productIds = products.map((x) => x.product);
    const checkPrdct = await Products.find({ _id: { $in: productIds } });
    if (productIds.length !== checkPrdct.length) {
      return res.status(404).json({ message: "product Not Found", success: false });
    }
    // console.log(chechProduct);
    // const result = new Orders({
    //   customer,
    //   products,
    //   deliveryAddress,
    // });
    //await result.save();

    let session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const order = new Orders({
        customer,
        products,
        deliveryAddress,
      });
      const docSave = await order.save({ session });
      const quantity = docSave.products[0].quantity;
      console.log("customer added quatity:", quantity);
      const result = await Product.findOne({ _id: id }).session(session);
      console.log(result);
      updatedStock = result.stock - quantity;
      if (updatedStock < 0) {
        throw new Error("out of stock");
      }
      await Product.findByIdAndUpdate({ _id: "641038051cd638bce2aa592c" }, { $set: { stock: updatedStock } }).session(session);
      console.log(updatedStock);
    });

    return res.status(200).json({ data: result, message: "successfull", success: true });
  } catch (err) {
    console.log(err);
  }
});
//==========================get order Api========================
route.get("/", async (req, res) => {
  try {
    const { id } = req.query;
    const { error } = joiGetIdOrder.validate(req.query);
    if (error) {
      return res.status(400).send("invalid order request");
    }
    // custoer validation
    const checkOrd = await Orders.findById(id).populate("customer").populate("products.product");

    if (checkOrd) {
      return res.status(200).json({ data: checkOrd, message: "successfull", success: true });
    }
    return res.status(404).json({ message: "order details not found", success: false });

    // products validation
  } catch (err) {
    console.log(err);
  }
});

//==============================MULTIPLE ORDERS GET API===============================================
route.get("/all", async (req, res) => {
  try {
    const { customer } = req.query;
    const { error } = joiGetOrder.validate(req.query);
    if (error) {
      return res.status(400).send(error);
    }
    const cust = await Customers.findById(customer);
    if (!cust) {
      return res.status(404).json({ message: "no customer details found", success: false });
    }
    const reslt = await Orders.find({ customer }).populate("customer").populate("products.product");
    return res.status(200).json({ data: reslt, message: "successfully fetched order details", success: true });
  } catch (err) {
    console.log(err);
  }
});
//=======================PUT API================================
route.put("/", async (req, res) => {
  try {
    const { id, status } = req.body;
    const { error } = joiOrderUpdate.validate(req.body);
    if (error) {
      return res.status(400).send(error);
    }
    const reslt = await Orders.findById(id);
    if (!reslt) {
      return res.status(404).json({ message: "no product found", success: false });
    }
    reslt.status = status;
    await reslt.save();
    return res.status(200).json({ data: reslt, message: "successfully updated product details", success: true });
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
