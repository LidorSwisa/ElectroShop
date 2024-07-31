const { Request, Response } = require("express");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const { UserLoginScheme } = require("../validation/index");
const { comparePassword, encryptJsonWebToken } = require("../utils");
/**
 * Handles user login.
 * @async
 * @function getUserByEmail
 * @param {string} email - The user's email.
 */
const getUserByEmail = async (email) => {
  const userFromDb = await User.findOne({ email })
    .populate({
      path: "cart",
      populate: {
        path: "items",
        populate: {
          path: "item",
        },
      },
    })
    .populate("orders")
    .populate("reviews");
  if (userFromDb && !userFromDb.cart) {
    const cart = await Cart.create({
      createdAt: new Date(),
      user: userFromDb._id,
      items: [],
    });
    userFromDb.cart = cart._id;
    userFromDb = await userFromDb.save();
    userFromDb = await userFromDb.populate("cart");
  }
  if (userFromDb) return userFromDb;
};

/**
 * Handles user login.
 * @async
 * @function login
 * @param {string} id - The user's id .
 */
const getUserById = async (id) => {
  let userFromDb = await User.findById(id)
    .populate({
      path: "cart",
      populate: {
        path: "items",
        populate: {
          path: "item",
        },
      },
    })
    .populate({
      path: "orders",
      populate: {
        path: "cart",
        populate: {
          path: "items",
          populate: {
            path: "item",
          },
        },
      },
    })
    .populate("reviews");
  if (userFromDb && !userFromDb.cart) {
    const cart = await Cart.create({
      createdAt: new Date(),
      user: userFromDb._id,
      items: [],
    });
    userFromDb.cart = cart._id;
    userFromDb = await userFromDb.save();
    userFromDb = await userFromDb.populate("cart");
  }
  return userFromDb;
};

/**
 * Handles user registration.
 * @async
 * @function register
 * @param {User} user - The request object.
 * @returns {Promise<User>}
 */
const createUser = async (user) => {
  let userFromDb = await User.create(user);

  const cart = await Cart.create({
    createdAt: new Date(),
    user: userFromDb._id,
    items: [],
  });
  userFromDb.cart = cart._id;
  userFromDb = await userFromDb.save();
  userFromDb = await userFromDb.populate("cart");
  return userFromDb;
};

/**
 * toggle item on favorites
 * @param {*} userId
 * @param {*} productId
 * @returns user
 */
const toggleFavorite = async (userId, productId) => {
  let user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.favorites.findIndex((p) => p == productId) !== -1) {
    user.favorites = user.favorites.filter((id) => id != productId);
  } else {
    user.favorites.push(productId);
  }
  user = await user.save();
  user = await user.populate("favorites");
  return user;
};

/**
 * Exports the user-related functions.
 * @module UserDAL
 */
module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  toggleFavorite,
};
