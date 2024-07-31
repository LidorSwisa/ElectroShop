const { Request, Response } = require("express");
const User = require("../models/user.model");
const { UserLoginScheme, UserRegisterScheme } = require("../validation/index");
const authDal = require("../dal/auth.dal");
const { encryptJsonWebToken, comparePassword, encryptPassword } = require("../utils");

/**
 * Handles user login.
 * @async
 * @function login
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<{access_token: string}>}
 */
const login = async (req, res) => {
  try {
    const form = UserLoginScheme.parse(req.body);
    const userFromDb = await authDal.getUserByEmail(form.email);

    if (!userFromDb) {
      throw new Error(`No such email ${form.email}`);
    }
    if (!comparePassword(form.password, userFromDb.password)) {
      throw new Error("Passwords do not match");
    }

    const access_token = encryptJsonWebToken({ _id: userFromDb.id, isAdmin: userFromDb.isAdmin });
    return res.status(200).json({
      error: null,
      status: 200,
      data: {
        access_token,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: e,
      status: 400,
      data: null,
    });
  }
};

/**
 * Handles user registration.
 * @async
 * @function register
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<User>}
 */
const register = async (req, res) => {
  try {
    const form = UserRegisterScheme.parse(req.body);
    const existingUser = await authDal.getUserByEmail(form.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = encryptPassword(form.password);

    const user = {
      ...form,
      password: hashedPassword,
    };

    const registeredUser = await authDal.createUser(user);

    return res.status(201).json({
      error: null,
      status: 201,
      data: registeredUser,
    });
  } catch (e) {
    return res.status(400).json({
      error: e.errors ? e.errors : e.message,
      status: 400,
      data: null,
    });
  }
};

/**
 * Retrieves the current user's information.
 * @async
 * @function me
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<User>}
 */
const me = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await authDal.getUserById(id);
    return res.status(200).json({
      error: null,
      status: 200,
      data: user,
    });
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      error: e.errors ? e.errors : e.message,
      status: 400,
      data: null,
    });
  }
};

/**
 * toggle item on favorites
 * @param {*} req
 * @param {*} res
 * @returns
 */
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const user = await authDal.toggleFavorite(userId, productId);
    return res.status(200).json({
      error: null,
      status: 200,
      data: user,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
};

/**
 * Exports the user-related functions.
 * @module UserController
 */
module.exports = {
  register,
  login,
  toggleFavorite,
  me,
};
