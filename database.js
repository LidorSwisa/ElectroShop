const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env.dev" });
const Category = require("./models/category.model");
const Product = require("./models/product.model");
const User = require("./models/user.model");
const Order = require("./models/order.model");
const Cart = require("./models/cart.model");
const Review = require("./models/review.model");

const conn = mongoose.connect(process.env.MONGO_URI);


module.exports = conn;
