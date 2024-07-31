const Branch = require("../models/branch.model");

const getAllBranches = async () => {
  return await Branch.find();
};

module.exports = {
  getAllBranches,
};
