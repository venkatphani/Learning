const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  //unique
  mobileNum: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //array of address
  address: {
    type: [
      {
        type: String,
        required: true,
      },
    ],
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE",
  },
});
module.exports = mongoose.model("customers", customerSchema);
