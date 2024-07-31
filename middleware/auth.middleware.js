const { decryptJsonWebToken } = require("../utils");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers["Auhtorization"] || req.headers["authorization"];
    if (!header) {
      throw new Error("Unthorized request, access token not provided");
    }
    const token = header.slice("Bearer".length + 1);
    if (!token) {
      throw new Error("Unthorized request, access token format invalid");
    }
    const decoded = decryptJsonWebToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({
      status: 401,
      error: e,
      data: null,
    });
  }
};

module.exports = authMiddleware;
