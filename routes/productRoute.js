const express = require("express");
const app = express();
const route = express.Router();
const joi = require("joi");
const products = require("../models/products");
//const products = require("../models/products");
const Products = require("../models/products");

//============JOI PRODUCT VALIDATION SCHEMA
const joiProductValidation = joi.object({
  name: joi.string().required(),
  price: joi.number().required(),
  manufactureYear: joi.number().required(),

  //isDeal: joi.string(),
  mrpPrice: joi.number().required(),
  category: joi.string().required(),
  // status: joi.string().required(),
});
//  productDescription: joi.string(),

//   category: joi.array().items(joi.string())required(),
// });
//============JOI PRODUCT UPDATE VALIDATION SCHEMA
const joiProductUpdate = joi.object({
  id: joi.string().required(),
  price: joi.number().required(),
});

//============JOI  GET  SINGLE PRODUCT VALIDATION SCHEMA

const joiGetProduct = joi.object({
  id: joi.string().required(),
});

//===========JOI  GET  ALL PRODUCT VALIDATION SCHEMA

const joiGetAllProduct = joi.object({
  category: joi.string().required,
});

//===============================PRODUCT POST API===============================================
route.post("/", async (req, res) => {
  try {
    const { error } = joiProductValidation.validate(req.body);
    if (error) {
      return res.send(400).json({ message: "bad request", success: false });
    }
    const { name, price, manufactureYear, mrpPrice, category } = req.body;
    const newProduct = new Products({
      name,
      price,
      manufactureYear,
      mrpPrice,
      category,
    });
    const newlyaddedprdct = await newProduct.save();
    return res.status(200).json({ data: newlyaddedprdct, message: "product added successfully", success: true });
  } catch (err) {
    console.log(err);
  }
});

//======PRODUCT UPDATE API========//

route.put("/", async (req, res) => {
  try {
    const { id, price } = req.body;
    const { error } = joiProductUpdate.validate(req.body);
    if (error) {
      res.status(400).send(error);
      return;
    } else {
      const reslt = await Products.findById(id);
      if (reslt) {
        reslt.price = price;
        await reslt.save();
        return res.status(200).json({ message: "successfully updated product details", success: true });
      } else {
        return res.status(404).json({ message: "no product found", success: false });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

//==============================SINGLE PRODUCT GET API===============================================

route.get("/product", async (req, res) => {
  try {
    const { id } = req.body;
    const { error } = joiGetProduct.validate(req.body);
    if (error) {
      res.status(400).send(error);
      return;
    } else {
      const reslt = await Products.findById(id);
      if (reslt) {
        res.status(200).json({ data: reslt, message: "successfully fetched single product details", success: true });
      } else {
        res.status(404).json({ message: "no product found", success: false });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

//==============================MULTIPLE PRODUCTS GET API===============================================
route.get("/product/all", async (req, res) => {
  try {
    const { category } = req.body;
    const { error } = joiGetAllProduct.validate(req.body);
    if (error) {
      res.status(400).send(error);
      return;
    } else {
      const reslt = await Products.find({ category });
      res.status(200).json({ data: reslt, message: "successfully fetched product details", success: true });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
