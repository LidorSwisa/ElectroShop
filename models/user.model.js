const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts", required: false },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders", required: false }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "products", required: false }],
    isAdmin: { type: Boolean, default: false },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "reviews", required: true }],
    name: { type: String, required: true },
    birthDay: { type: Date, require: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const User = mongoose.model("users", UserSchema);

module.exports = User;
