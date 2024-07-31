const branchesDal = require("../dal/branches.dal");
const getAllBranches = async (req, res) => {
  try {
    const branches = await branchesDal.getAllBranches();
    return res.status(200).json({
      error: null,
      status: 200,
      data: branches,
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
  getAllBranches
};
