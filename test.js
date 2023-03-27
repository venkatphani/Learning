const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/products");
const Order = require("./models/orders");
const uri = "mongodb+srv://pradeep:c2baRqdg55Zyo7nK@cluster0.5bzuqpc.mongodb.net/test";
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
async function sessionTransaction() {
  //startSession
  //startTransaction
  //commitTransaction
  //endSession

  try {
    let session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const order = new Order({
        customer: "6414b6835eebb7793a375e90",
        products: [
          {
            product: "641035b731ffaad0bfc71c49",
            quantity: 2,
          },
        ],
        deliveryAddress: " Kakinada,Telangana",
      });
      const docSave = await order.save({ session });
      const quantity = docSave.products[0].quantity;
      console.log("customer added quatity:", quantity);
      const result = await Product.findOne({ _id: "6410383b2f7f1d7447afc835" }).session(session);
      console.log(result);
      updatedStock = result.stock - quantity;
      if (updatedStock < 0) {
        throw new Error("out of stock");
      }
      await Product.findByIdAndUpdate("6410383b2f7f1d7447afc835", { $set: { stock: updatedStock } }).session(session);
      console.log(updatedStock);
    });
  } catch (err) {
    console.log(err);
  } finally {
    //if (session) {
    // session().endSession();
    // }
  }
}
sessionTransaction();
