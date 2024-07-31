const productDAL = require("../dal/product.dal");

const getProducts = async (req, res) => {

  try {
    const { category } = req.query;

    const products = await productDAL.getProductsByCategoryAndPriceRange(
      category,
      req.query.minPrice ?? 0,
      req.query.maxPrice ?? Number.MAX_VALUE
    );
    return res.status(200).json({
      error: null,
      status: 200,
      data: products,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await productDAL.searchProducts(query);
    return res.status(200).json({
      error: null,
      status: 200,
      data: products,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await productDAL.getCategories();
    return res.status(200).json({
      error: null,
      status: 200,
      data: categories,
    });
  } catch (e) {
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
};

module.exports = {
  getProducts,
  getCategories,
  searchProducts
};
