const express = require("express");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  manufactureYear: {
    type: Number,
    required: true,
  },
  isDeal: {
    type: String,
    required: false,
  },
  mrpPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["INSTOCK", "OUTOFSTOCK"],
    default: "INSTOCK",
  },
  category: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("products", productSchema);
