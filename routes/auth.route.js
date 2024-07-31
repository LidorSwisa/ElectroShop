const authController = require("../controllers/auth.controller");

const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", authMiddleware, authController.me);

router.put("/toggleFavorite", authMiddleware, authController.toggleFavorite);

module.exports = router;
