const express = require("express");
const app = express();
const mongoose = require("mongoose");
const uri = "mongodb+srv://pradeep:c2baRqdg55Zyo7nK@cluster0.5bzuqpc.mongodb.net/test";
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// const bodyParser = require("body-parser");
const Customers = require("./models/customers");
// //======ROUTES==========
const customerRoute = require("./routes/customerRoute");
const orderRoute = require("./routes/orderRoute");
const productRoute = require("./routes/productRoute");
// app.use(express.json());
app.use("/orders", orderRoute);
app.use("/customers", customerRoute);
app.use("/products", productRoute);
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log("error cannot connect", err);
  });
console.log("11118888");

// =============== CREATE METHOD ================================

async function userCreate() {
  console.log(Customers);

  const newCustomer = new Customers({
    // customerName: "Rahul",

    customerMobileNum: 9988776655,
    customerEmailId: "rahul@gmail.com",
    customerAddress: " Sangareddy Telangana",
  });

  //console.log(Customers);
  try {
    const res = await newCustomer.save();
    //console.log(res);
  } catch (err) {
    console.log(err);
  }
}

//userCreate();

//=============== FIND METHOD ===============================
async function userFind() {
  const resp = await Customers.find({ customerId: "cus2" });
  if (resp) {
    console.log("user fouund");
  } else {
    console.log("user not found");
  }
}

//userFind();

// //=============== UPDATE METHOD ================================
// async function userUpdate(id) {
//   const result = await Customers.findByIdAndUpdate(
//     { _id: id },
//     {
//       $set: {
//         customerId: "cus3",
//       },
//     }
//   );
//   console.log(result);
// }
// //userUpdate("640f29a6563d596df5bf1538");

// //=============== DELETE METHOD ================================
// async function userDelete() {
//   const result = await Customers.deleteOne({ customerName: "ROHIT" });
//   console.log(result);
// }
//userDelete();
//var port = process.env.PORT;
app.listen(2020, () => {
  //console.log("listening at " + port + "....");
});
