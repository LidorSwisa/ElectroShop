const mongoose = require('mongoose')
const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: false },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "cartitems" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
} ,{versionKey: false});

const Cart = mongoose.model("carts", CartSchema);

module.exports = Cart;
