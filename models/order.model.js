const mongoose = require("mongoose");
const OrderScheme = new mongoose.Schema(
  {
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts", required: true },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    cardInfo: {
      cardHolderName: { type: String, required: true },
      expiryDate: { type: String, required: true },
      fourDigits: { type: String, required: true },
      CVV: { type: String, required: true },
    }
  },
  { versionKey: false }
);

const Order = mongoose.model("orders", OrderScheme);

module.exports = Order;
