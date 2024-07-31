
const adminMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user.isAdmin) {

      throw new Error("Unauthorized request, user is not an admin");
    }
    next();
  } catch (e) {
    res.status(401).json({
      status: 401,
      error: e,
      data: null,
    });
  }
};

module.exports = adminMiddleware;
