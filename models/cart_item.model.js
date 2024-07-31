const mongoose = require("mongoose");
const CartItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    quantity: { type: Number, required: true },
  },
  { versionKey: false }
);

const CartItem = mongoose.model("cartitems", CartItemSchema);

module.exports = CartItem;
