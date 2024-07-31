const orderDAL = require("../dal/order.dal");
const { OrderSubmissionScheme } = require("../validation/index");

async function createOrder(req, res) {
  try {
    const orderData = OrderSubmissionScheme.parse(req.body);
    const { order, user } = await orderDAL.createOrder(orderData);
    return res.status(200).json({
      error: null,
      status: 200,
      data: {
        order,
        user,
      },
    });
  } catch (e) {
    console.log(e)
    return res.status(500).json({
      error: e,
      data: null,
      status: 500,
    });
  }
}

module.exports = {
  createOrder,
};
