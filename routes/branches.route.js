
const express = require("express");
const router = express.Router();

const branchesController = require("../controllers/branches.controller");

router.get("/getAllBranches", branchesController.getAllBranches);

module.exports = router;