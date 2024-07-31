const User = require("../models/user.model");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

// make new order:
async function createOrder(orderData) {
  let user = await User.findById(orderData.user);
  const order = new Order(orderData);
  // remove user from previous cart
  const newCart = await Cart.create({
    items: [],
    user: orderData.user,
  });
  user.cart = newCart._id;
  // add order to user's orders:
  if (!user.orders) {
    user.orders = [order._id];
  } else {
    user.orders.push(order._id);
  }
  user = await user.save();
  const cart = await Cart.findById(orderData.cart);
  cart.user = null;
  await cart.save();
  await order.save();
  user = await User.findById(orderData.user)
    .populate({
      path: "cart",
      populate: {
        path: "items",
        populate: {
          path: "item",
        },
      },
    })
    .populate({path:"orders", populate: {
      path: "cart",
      populate: {
        path: "items",
        populate: {
          path: "item",
        }
      }
    }})
    .populate("reviews");

  return {
    order,
    user,
  };
}

module.exports = {
  createOrder,
};
