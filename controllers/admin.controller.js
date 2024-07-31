const { CreateProductScheme, CreateCategoryScheme } = require("../validation/index");
const adminDAL = require("../dal/admin.dal");

async function createProduct(req, res) {
  try {
    const scheme = CreateProductScheme.parse(req.body);
    const product = await adminDAL.createProduct(scheme);
    return res.status(201).json({
      error: null,
      status: 201,
      data: product,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function createCategory(req, res) {
  try {
    const { name } = CreateCategoryScheme.parse(req.body);
    const category = await adminDAL.createCategory(name);
    return res.status(201).json({
      error: null,
      status: 201,
      data: category,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function linkProductToCategory(req, res) {
  try {
    const { productId, categoryId } = req.body;
    const product = await adminDAL.linkPruductToCategory(productId, categoryId);
    return res.status(200).json({
      error: null,
      status: 200,
      data: product,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function unlinkProductFromCategory(req, res) {
  try {
    const { productId, categoryId } = req.body;
    const product = await adminDAL.unlinkPruductFromCategory(productId, categoryId);
    return res.status(200).json({
      error: null,
      status: 200,
      data: product,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function getAverageOrderTotal(req, res) {
  try {
    const result = await adminDAL.getAverageOrderTotal();
    return res.status(200).json({
      error: null,
      status: 200,
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function getUsersWithMoreThanFiveOrders(req, res) {
  try {
    const result = await adminDAL.getUsersWithMoreThanFiveOrders();
    return res.status(200).json({
      error: null,
      status: 200,
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function getUsersWithMoreThan100Spent(req, res) {
  try {
    const result = await adminDAL.getUsersWithMoreThan100Spent();
    return res.status(200).json({
      error: null,
      status: 200,
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function getUsersWithMoreThanFiveItemsInCart(req, res) {
  try {
    const result = await adminDAL.getUsersWithMoreThanFiveItemsInCart();
    return res.status(200).json({
      error: null,
      status: 200,
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function getAllProductSales(req, res) {
  try {
    const result = await adminDAL.getAllProductSales();
    return res.status(200).json({
      error: null,
      status: 200,
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await adminDAL.getAllOrders();
    return res.status(200).json({
      error: null,
      status: 200,
      data: orders,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}


async function getSalesByCategory(req, res) {
  try {
    const result = await adminDAL.getSalesByCategory();
    return res.status(200).json({
      error: null,
      status: 200,
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}
module.exports = {
  createProduct,
  createCategory,
  linkProductToCategory,
  unlinkProductFromCategory,
  getSalesByCategory,
  getAllOrders,
  getAverageOrderTotal,
  getAllProductSales,
  getUsersWithMoreThanFiveOrders,
  getUsersWithMoreThan100Spent,
  getUsersWithMoreThanFiveItemsInCart,
};
