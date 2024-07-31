const cartDAL = require("../dal/cart.dal");
const { CartUpdateScheme } = require("../validation/index");

const updateCart = async (req, res) => {
  const userId = req.user._id;
  try {
    if (req.body && req.body.quantity) req.body.quantity = parseInt(req.body.quantity);
    const { itemId, quantity } = CartUpdateScheme.parse(req.body);

    const cart = await cartDAL.updateCart(userId, itemId, quantity);
    return res.status(200).json({
      error: null,
      status: 200,
      data: cart,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
};

module.exports = {
  updateCart,
};
