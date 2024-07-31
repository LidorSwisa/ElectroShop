const productController = require("../controllers/product.controller");

const express = require("express");
const router = express.Router();

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/categories", productController.getCategories);

module.exports = router;
