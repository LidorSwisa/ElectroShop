const authMiddleware = require("../middleware/auth.middleware");

const express = require("express"),
  router = express.Router();

const cartController = require("../controllers/cart.controller");
router.put("/update", authMiddleware, cartController.updateCart);

module.exports = router;
