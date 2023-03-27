const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "customers",
  },
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  couponCode: {
    type: String,
    required: false,
  },
  cost: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "EXCHANGED"],
    required: true,
    default: "ORDERED",
  },
});
module.exports = mongoose.model("orders", orderSchema);
