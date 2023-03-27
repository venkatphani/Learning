const express = require("express");
const jwt = require("jsonwebtoken");
const route = express.Router();
const joi = require("joi");
const Customers = require("../models/customers");
const tokenMiddleware = require("../middleware");
//=============JOI VALIDATION SIGN UP SCHEMA===============//
const joiSignupSchema = joi.object({
  name: joi.string().required(),
  mobileNum: joi.number().required().min(6000000000).max(9999999999),
  email: joi.string().email().required(),
  password: joi.string().required().min(6),
});

//==============JOI LOGIN SCHEMA=============
const joiLoginSchema = joi.object({
  mobileNum: joi.number().required().min(6000000000).max(9999999999),
  password: joi.string().required().min(6),
});

// =================JOI CUSTOMER UPDATE SCHEMA VALIDATION==========
const joiUpdateSchema = joi.object({
  email: joi.string().email().required(),
});

// =================JOI ORDER SCHEMA VALIDATION==========
const joiOrderSchema = joi.object({
  customer: joi.string().required(),
  products: joi.array().required(),
  deliveryAddress: joi.string().required(),
  status: joi.array().required(),
});
//==================JOI CHANGE PASSWORD SCHEMA===============
const joiPasswordValidation = joi.object({
  password: joi.string().min(6).required(),
  id: joi.string().required(),
});

//============Signup Api=================
route.post("/signup", async (req, res) => {
  // request validation
  try {
    const { name, mobileNum, email, password } = req.body;
    //request validation later convert to middleware
    const { error } = joiSignupSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ error, success: false });
    } else {
      const user = await Customers.findOne({ mobileNum });
      if (!user) {
        const newUser = new Customers({
          name,
          mobileNum,
          email,
          password,
        });
        const result = await newUser.save();
        return res.status(200).send({ data: result, message: "SUccessfuly registered", success: true });
      } else {
        return res.status(409).json({ message: "User Already Exists", success: false });
      }
    }
  } catch (err) {
    console.log("something went wrong", err);
  }
});

//================Login Api==========================

route.post("/login", async (req, res) => {
  try {
    const { error } = joiLoginSchema.validate(req.body);
    const { mobileNum, password } = req.body;
    if (error) {
      console.log(error);
      return res.status(400).json({ error, success: false });
    }

    const result = await Customers.findOne({ mobileNum, password });
    //customerPassword: value.customerPassword });
    if (!result) {
      return res.status(404).send({ message: "user not found please register first" });
    }
    const key = "abcd@1234";
    const payload = {
      id: result.id,
    };

    jwt.sign(payload, key, (err, token) => {
      if (err) {
        return res.status(400).send("failed to generate access token");
      }
      return res.status(200).json({ data: { customer: result, token: `Bearer ${token}` }, message: "login successful", success: true });
    });
  } catch (err) {
    console.log(err);
  }
});

route.get("/mydata", tokenMiddleware, async (req, res) => {
  try {
    const { user } = req;
    return res.status(200).json({ data: user, message: "login successful", success: true });
  } catch (err) {
    return res.status(400).send(err);
  }
});

//====================JOI Update EmailId API=================

route.put("/update", tokenMiddleware, async (req, res) => {
  const { email } = req.body;
  const { error } = joiUpdateSchema.validate(req.body);
  const { user } = req;
  if (error) {
    return res.status(400).json({ error, success: false });
  }
  user.email = email;
  const updatedUser = await user.save();
  return res.status(200).send({ data: updatedUser, message: "updated successfully", success: true });
});

route.put("/update/password", async (req, res) => {
  console.log("comings");
  const { password, id } = req.body;
  const { error } = joiPasswordValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error, success: false });
  } else {
    const user = await Customers.findById(id);
    console.log(user);
    if (user) {
      user.password = password;
      const updatedUser = await user.save();
      return res.status(200).send({ data: updatedUser, message: "updated successfully", success: true });
    } else {
      return res.status(404).json({ message: "User not found", success: false });
    }
  }
});

module.exports = route;

// post/signup
// login
// put/change password
// delete - accout status inactive

//============product ============
//post
// put
// delete - status
// get - all products by category
// get - single product

//===========order========
//post - product - reference, product qt, copupon code, delivery address, customer - refere, status
// put - shipped, delivered, cancelled,
// get - for a single customer

// request validations are must
// try catch are must
// validations in the try are must, email id whether this exists?
// status ids are must, data, message

// jwt done
// jwt middleware, request validation middleware, requst keys value middleware
// customer doesnt exist, 404 customer doesnt exist
