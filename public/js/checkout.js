$("html, body").animate(
  {
    scrollTop: $("footer").offset().top - 10,
  },
  1000
);

function checkOutProductCard(cartProduct) {
  const product = cartProduct.item;
  const quantity = cartProduct.quantity;
  return `
    <div class="product-card">
        <div class="card-image">
            <img src="${product.images[0].url}" alt="${product.name}">
        </div>
        <div class="card-content">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price.amount} <small>${product.price.currency}</small></p>
            <p class="availability">${product.availability}</p>
        </div>
        <div class="card-footer">
        <div>
            <p>Quantity: ${quantity}</p>
        </div>
            <div class="card-add-to-cart">
                <input id="${product._id}_quantity" style="width: 100px; height:30px;" type="number" min="1" value="1" max="${quantity}"></input>
            </div>
        </div>
    </div>
  `;
}

const renderCheckoutPage = async () => {
  let user;
  try {
    user = await getAccount();
  } catch (e) {
    console.log(e);
  }

  const cart = user.cart;
  $("#product-container").remove();

  if (cart.items.length === 0) {
    $("#checkout-container").html(`
    <div>
    <h2>Checkout</h2>
    <hr/>
    <div id="cart-items">
      <h4>No items in cart</h4>
      <a href="/">Back home</a>
    </div>
    </div>
    `);
    return;
  }

  const cartItems = cart.items.map(checkOutProductCard);
  console.log(cart);

  $("#checkout-container").html(`
  <div class="checkout-grid">
  <div>
    <h2>Checkout</h2>
    <hr/>
    <h3>Items</h3>
    <div id="cart-items">
      ${cartItems.join("")}
    </div>

  <div style="flex-direction: column; display:flex; gap: .25rem; padding: 1rem; display:block;">
    <div>
      <b>Subtotal</b>
      <span id="subtotal">
        $${cart.items
          .reduce((acc, cartItem) => {
            return acc + cartItem.item.price.amount * cartItem.quantity;
          }, 0)
          .toFixed(2)}
      </span>
    </div>
    <div>
      <b>Shipping</b>
      <span id="shipping">
        $${cart.items
          .reduce((acc, cartItem) => {
            return acc + 5 * cartItem.quantity;
          }, 0)
          .toFixed(2)}
      </span>
    </div>

    <hr/>
    <div>
    <b>Total</b>
    <span id="total">
      ${cart.items
        .reduce((acc, cartItem) => {
          return acc + cartItem.item.price.amount * cartItem.quantity + 5 * cartItem.quantity;
        }, 0)
        .toFixed(2)} ${cart.items[0]?.item.price.currency ?? ""}
    </span>
  </div>
    </div>
    </div>
      <form id="checkout-form" onsubmit="submitCheckout(event)">
        <h4 style="margin:0;">Shipping Information</h4>
        <div>
          <label>Name</label>
          <input name="full-name" type="text" placeholder="Full Name" id="full-name" value="${
            user.name
          }" required>
        </div>
        <hr style="width: 100%;"/>
        <h4 style="margin:0;">Shipping Address</h4>
        <div>
          <input name="country" type="text" placeholder="Country" id="country" required><br/>
          <input name="city" type="text" placeholder="City" id="city" required><br/>
          <input name="street" type="text" placeholder="Street" id="street" required><br/>
          <input name="house-number" type="text" placeholder="House Number" id="house-number" required><br/>
          <input name="zip-code" type="text" placeholder="Zip Code" id="zip-code" required>
        </div>
        <div>
          <label>Phone Number</label>
          <input name="phone-number" type="text" placeholder="Phone Number" id="phone-number" required>
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="text" placeholder="Email" id="email" required value="${
            user.email
          }">
        </div>
        <hr style="width: 100%;"/>
        <h4 style="margin:0;">Payment information</h4>
        <div>
          <input name="card-holder" type="text" placeholder="Card Holder Name" id="card-holder-name" required><br/>
          <input name="expiry-date" type="date" placeholder="Expiry Date" id="expiry-date" required><br/>
          <input name="four-digits" type="text" placeholder="Card Number" id="four-digits" required><br/>
          <input name="cvv" type="text" placeholder="CVV" id="cvv" required>
          <img width="150px" style="padding: 1rem; align-self: flex-end;" src="../static/images/visa.png"/>
        </div>
        <button type="submit" id="checkout-button">Submit order</button>
      </form>
    </div>


  `);
};
/*
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts", required: true },
    address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    cardInfo: {
      cardHolderName: { type: String, required: true },
      expiryDate: { type: String, required: true },
      fourDigits: { type: String, required: true },
      CVV: { type: String, required: true },
    }
  },
  */
const submitCheckout = async (e) => {
  e.preventDefault();
  const cart = user.cart;
  const form = Object.fromEntries(new FormData(e.target).entries());

  const order = {
    cart: cart._id,
    address: {
      country: form.country,
      city: form.city,
      street: form.street,
      houseNumber: form["house-number"],
      zipCode: form["zip-code"],
    },
    user: user._id,
    email: form.email,
    phone: form["phone-number"],
    name: form["full-name"],
    cardInfo: {
      cardHolderName: form["card-holder"],
      expiryDate: form["expiry-date"],
      fourDigits: form["four-digits"],
      CVV: form.cvv,
    },
  };
  console.log(order);

  $.ajax({
    url: "/order",
    method: "POST",
    data: order,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        Toastify({
          text: "Order submitted",
          backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
          className: "info",
        }).showToast();
        saveUserLocally(response.data.user);
        window.location.href = "/account";
      }
    },
  });
};

renderCheckoutPage();
