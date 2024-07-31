
const express = require("express"),
  router = express.Router();

const orderController = require("../controllers/order.controller");
router.post("/", orderController.createOrder);

module.exports = router;
