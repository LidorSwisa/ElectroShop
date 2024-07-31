const Category = require("../models/category.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

async function createCategory(categoryName) {
  const existing = await Category.findOne({ name: categoryName });
  if (!existing) {
    const category = await Category.create({
      name: categoryName,
    });
    return category;
  }
  return existing;
}

async function createProduct(scheme) {
  const category = await Category.findOne({ name: scheme.category });
  if (!category) {
    throw new Error("Category not found");
  }
  scheme.category = category._id;
  const product = await Product.create(scheme);
  return product;
}

async function linkPruductToCategory(productId, categoryId) {
  const product = await Product.findById(productId);
  const category = await Category.findById(categoryId);
  product.category = category._id;
  category.products.push(product._id);
  let p = await product.save();
  p = await p.populate(["category", "reviews"]);
  return p;
}

async function unlinkPruductFromCategory(productId, categoryId) {
  const product = await Product.findById(productId);
  const category = await Category.findById(categoryId);
  product.category = null;
  category.products = category.products.filter((p) => p.toString() !== productId);
  let p = await product.save();
  p = await p.populate(["category", "reviews"]);
  return p;
}
async function getAverageOrderTotal() {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: "carts",
        localField: "cart",
        foreignField: "_id",
        as: "cartDetails",
      },
    },
    {
      $unwind: "$cartDetails",
    },
    {
      $unwind: "$cartDetails.items",
    },
    {
      $lookup: {
        from: "cartitems",
        localField: "cartDetails.items",
        foreignField: "_id",
        as: "cartItemDetails",
      },
    },
    {
      $unwind: "$cartItemDetails",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItemDetails.item",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $group: {
        _id: "$_id",
        totalItems: { $sum: "$cartItemDetails.quantity" },
        totalPrice: {
          $sum: { $multiply: ["$cartItemDetails.quantity", "$productDetails.price.amount"] },
        },
      },
    },
    {
      $match: {
        totalItems: { $gte: 1 },
      },
    },
    {
      $group: {
        _id: null,
        averageTotalPrice: { $avg: "$totalPrice" },
      },
    },
  ]);

  return result.length > 0 ? result[0].averageTotalPrice : 0;
}
async function getUsersWithMoreThanFiveOrders() {
  const result = await User.aggregate([
    {
      $project: {
        email: 1,
        name: 1,
        orderCount: { $size: "$orders" }, // Calculate the number of orders for each user directly from the orders array in the User document
      },
    },
    {
      $match: {
        orderCount: { $gte: 5 }, // Filter users with more than 5 orders
      },
    },
    {
      $project: {
        _id: 0,
        email: 1,
        name: 1,
        orderCount: 1, // Include the count of orders in the output
      },
    },
  ]);

  return result;
}

async function getUsersWithMoreThan100Spent() {
  const result = await User.aggregate([
    {
      $lookup: {
        from: "orders",
        localField: "_id", // Assuming the user's ID is referenced in orders
        foreignField: "user",
        as: "orderDetails",
      },
    },
    {
      $unwind: "$orderDetails",
    },
    {
      $lookup: {
        from: "carts",
        localField: "orderDetails.cart",
        foreignField: "_id",
        as: "cartDetails",
      },
    },
    {
      $unwind: "$cartDetails",
    },
    {
      $unwind: "$cartDetails.items",
    },
    {
      $lookup: {
        from: "cartitems",
        localField: "cartDetails.items",
        foreignField: "_id",
        as: "cartItemDetails",
      },
    },
    {
      $unwind: "$cartItemDetails",
    },
    {
      $lookup: {
        from: "products",
        localField: "cartItemDetails.item",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $group: {
        _id: "$_id",
        totalSpent: {
          $sum: { $multiply: ["$cartItemDetails.quantity", "$productDetails.price.amount"] },
        },
      },
    },
    {
      $match: {
        totalSpent: { $gte: 100 },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        totalSpent: 1,
      },
    },
  ]);

  return result;
}

async function getUsersWithMoreThanFiveItemsInCart() {
  const result = await User.aggregate([
    {
      $lookup: {
        from: "carts",
        localField: "cart", // Assuming 'cart' is the field in User schema referring to the Cart ID or array of Cart IDs
        foreignField: "_id",
        as: "cartDetails",
      },
    },
    {
      $unwind: "$cartDetails", // Normalize the document structure if 'cart' refers to a single ID or the first in an array
    },
    {
      $unwind: "$cartDetails.items", // Unwind items in each cart to calculate total items per user
    },
    {
      $lookup: {
        from: "cartitems",
        localField: "cartDetails.items",
        foreignField: "_id",
        as: "cartItemDetails",
      },
    },
    {
      $unwind: "$cartItemDetails",
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        email: { $first: "$email" },
        totalItems: { $sum: "$cartItemDetails.quantity" }, // Summing up all items in all carts for each user
      },
    },
    {
      $match: {
        totalItems: { $gt: 5 }, // Filter users with more than 5 items across all carts
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: 1,
        email: 1,
        totalItems: 1,
      },
    },
  ]);

  return result;
}

async function getAllProductSales() {
  try {
    const result = await Order.aggregate([
      {
        // Join with Cart collection
        $lookup: {
          from: "carts",
          localField: "cart",
          foreignField: "_id",
          as: "cartDetails",
        },
      },
      {
        $unwind: "$cartDetails", // Unwind the array to normalize the data
      },
      {
        // Ensure the cart is actually linked to an order
        $match: {
          cartDetails: { $exists: true }, // This ensures that only carts that are linked to orders are processed
        },
      },
      {
        // Join with CartItem collection
        $lookup: {
          from: "cartitems",
          localField: "cartDetails.items",
          foreignField: "_id",
          as: "cartItemDetails",
        },
      },
      {
        $unwind: "$cartItemDetails", // Unwind to access individual cart items
      },
      {
        // Join with Product collection
        $lookup: {
          from: "products",
          localField: "cartItemDetails.item",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails", // Unwind to access product details
          preserveNullAndEmptyArrays: true, // Handle cases where no product is found
        },
      },
      {
        // Group by Product to sum quantities and fetch product name
        $group: {
          _id: "$productDetails._id",
          productName: { $first: "$productDetails.name" },
          totalSold: { $sum: "$cartItemDetails.quantity" },
        },
      },
      {
        // Project the desired fields, excluding _id
        $project: {
          _id: 0,
          productName: 1,
          totalSold: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Failed to get product sales:", error);
    return [];
  }
}

const getAllOrders = async () => {
  const orders = await Order.find()
    .populate({
      path: "cart",
      populate: {
        path: "items",
        populate: {
          path: "item",
        },
      },
    })
    .populate("user");
  return orders;
};
async function getSalesByCategory() {
  try {
    const result = await Order.aggregate([
      {
        $lookup: {
          from: "carts",
          localField: "cart",
          foreignField: "_id",
          as: "cartDetails",
        },
      },
      { $unwind: "$cartDetails" },
      {
        $lookup: {
          from: "cartitems",
          localField: "cartDetails.items",
          foreignField: "_id",
          as: "cartItemDetails",
        },
      },
      { $unwind: "$cartItemDetails" },
      {
        $lookup: {
          from: "products",
          localField: "cartItemDetails.item",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $lookup: {
          from: "categories",
          let: { category_id: { $toObjectId: "$productDetails.category" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$category_id"] } } }],
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$categoryDetails.name",
          totalSold: { $sum: "$cartItemDetails.quantity" },
          totalRevenue: {
            $sum: {
              $multiply: ["$cartItemDetails.quantity", "$productDetails.price.amount"],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: "$_id",
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return result;
  } catch (error) {
    console.error("Failed to get sales by category:", error);
    return [];
  }
}

module.exports = {
  createCategory,
  getAverageOrderTotal,
  getUsersWithMoreThanFiveOrders,
  getUsersWithMoreThan100Spent,
  getSalesByCategory,
  getUsersWithMoreThanFiveItemsInCart,
  createProduct,
  getAllOrders,
  linkPruductToCategory,
  linkPruductToCategory,
  unlinkPruductFromCategory,
  getAllProductSales,
};
