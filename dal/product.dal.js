const Category = require("../models/category.model");
const Product = require("../models/product.model");




/**
 * Get all products by category and price range.
 * @async
 * @function getProductsByCategoryAndPriceRange
 * @param {String} category - The category of the products.
 * @param {Number} minPrice - The minimum price of the products.
 * @param {Number} maxPrice - The maximum price of the products.
 * @returns {Promise<Array>} - A promise that resolves to an array of products.
 */
const getProductsByCategoryAndPriceRange = async (
  category,
  minPrice = 0,
  maxPrice = Number.MAX_VALUE
) => {
  try {
    if (!category && !minPrice && !maxPrice) {
      return await Product.find();
    }
    if (!category) {
      const products = await Product.find({
        "price.amount": { $gte: minPrice, $lte: maxPrice },
      });
      return products;
    }
    const products = await Product.find({
      "price.amount": { $gte: minPrice, $lte: maxPrice },
    }).populate("category");
    return products.filter((p) => p.category.name.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

//search products by query that is contained inside name, case insensitive
async function searchProducts(query) {
  return Product.find({ name: { $regex: query, $options: "i" } });
}

const getCategories = async () => {
  return Category.find();
};

module.exports = {
  getCategories,
  searchProducts,
  getProductsByCategoryAndPriceRange,
};
