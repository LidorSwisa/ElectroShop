const Cart = require("../models/cart.model");
const CartItem = require("../models/cart_item.model");

const updateCart = async (userId, itemId, quantity) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items",
    model: "cartitems",
    populate: {
      path: "item",
      model: "products",
    },
  });
  let existing = cart.items.find((cartItem) => cartItem.item._id == itemId);

  if (existing) {
    if (quantity > 0 || existing.quantity + quantity > 0) {
      const updated = await CartItem.findByIdAndUpdate(
        existing._id,
        { $inc: { quantity } },
        { new: true }
      ).populate("item");
      cart.items = cart.items.map((item) => (item.item._id == itemId ? updated : item));
      return cart;
    } else {
      const deleted = await CartItem.findByIdAndDelete(existing._id);
      cart.items = cart.items.filter((item) => item._id !== existing._id);
      await cart.save();
      return cart;
    }
  } else {
    if (quantity > 0) {
      const newItem = await CartItem.create({
        item: itemId,
        quantity,
      });
      cart.items.push(newItem);
      cart = await cart.save();
      cart = await cart.populate({
        path: "items",
        model: "cartitems",
        populate: {
          path: "item",
          model: "products",
        },
      });
      return cart;
    } else {
      return cart;
    }
  }
};

module.exports = {
  updateCart,
};
