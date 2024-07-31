const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

router.post("/createProduct", adminController.createProduct);
router.post("/createCategory", adminController.createCategory);
router.post("/linkProductToCategory", adminController.linkProductToCategory);
router.post("/unlinkProductFromCategory", adminController.unlinkProductFromCategory);

router.get("/getAverageOrderTotal", adminController.getAverageOrderTotal);
router.get("/getUsersWithMoreThanFiveOrders", adminController.getUsersWithMoreThanFiveOrders);
router.get("/getUsersWithMoreThan100Spent", adminController.getUsersWithMoreThan100Spent);
router.get(
  "/getUsersWithMoreThanFiveItemsInCart",
  adminController.getUsersWithMoreThanFiveItemsInCart
);
router.get("/getSalesByCategory", adminController.getSalesByCategory);
router.get("/getAllOrders", adminController.getAllOrders);
router.get("/getAllProductSales", adminController.getAllProductSales);
module.exports = router;
