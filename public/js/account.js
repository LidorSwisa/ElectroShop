function createAddressInfo(address) {
  return `
  <p class="account small">Country: ${address.country}</p>
  <p class="account small">City: ${address.city}</p>
  <p class="account small">Street: ${address.street}</p>
  <p class="account small">House number: ${address.houseNumber}</p>
  <p class="account  small">Zip code: ${address.zipCode}</p>
  `;
}
function createOrderCard(order) {
  console.log(order)
  const orderItems = order.cart.items.map((p) => {
    const product = p.item;
    const quantity = p.quantity;
    const totalPrice = product.price.amount * quantity;
    return `
    <div class="order-card">
        <p class="account">Product: ${product.name}</p>
        <p class="account">Price: ${product.price.amount}${product.price.currency}</p>
        <p class="account">Quantity: ${quantity}</p>
        <div>
          <p class="account">Total: ${totalPrice}</p>
        </div>
    </div>
 
    `;
  });

  const totalOrderPrice = order.cart.items.reduce((acc, item) => {
    return acc + item.item.price.amount * item.quantity;
  }, 0);

  return `
  <div class="order-card">
  <h4>Order Details</h4>
      <p class="account">Order items</p>
      <div class="order-items">
          ${orderItems.join("")}
      </div>
      <p class="account">Order total: ${totalOrderPrice}</p>
      <p class="account small">Address: ${createAddressInfo(order.address)}</p>
  </div>
  `;
}

async function renderAccountPage() {
  try {
    let user;
    try {
      user = await getAccount();
    } catch (e) {
      console.log(e);
    }

    $("#account-container").html(`
    <div>
        <h2>Account</h2>
        <p class="account">Username: ${user.name}</p>
        <p class="account">Email: ${user.email}</p>
        <p class="account">Account: ${user.isAdmin ? "Admin" : "Customer"}</p>
    </div>

    <div>
        <h2 style="margin:0;">Orders</h2>
        <div id="no-orders" style="display: ${user.orders.length > 0 ? "none" : "block"};">
            <p class="account">No orders found</p>
        </div>
        <div class="orders-grid">
            ${user.orders
              .map((order) => {
                return `<div class="order-wrapper">
                <h4>Order:${order._id} </h4>
                  ${createOrderCard(order)}
            </div>`
              }).join().replaceAll(",", "")}
        </div>
    </div>
  `);
    $("html, body").animate(
      {
        scrollTop: $("#account-container").offset().top,
      },
      500
    );
  } catch (e) {
    console.error("Error fetching account data:", e);
  }
}

renderAccountPage();
