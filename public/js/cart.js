function cartProductCard(cartProduct) {
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
                <button class="btn-buy" onclick="removeFromCart('${product._id}')">Remove</button>
            </div>
        </div>
    </div>
  `;
}
async function removeFromCart(productId) {
  let user;
  try {
    user = await getAccount();
  } catch (e) {
    console.log(e);
  }

  if (!user) {
    window.location.href = "/login";
    return;
  }
  const cartItem = user.cart.items.find((item) => item.item._id === productId);
  if (!cartItem) {
    Toastify({
      text: "Product not found in cart",
      backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      className: "info",
    }).showToast();
    return;
  }
  const quantity = $(`#${productId}_quantity`).val();
  const currQuantity = cartItem.quantity;
  if (currQuantity < quantity) {
    Toastify({
      text: "Quantity is more than available",
      backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      className: "info",
    }).showToast();
    return;
  }
  const response = await $.ajax({
    url: "/cart/update",
    method: "PUT",
    data: {
      itemId: productId,
      quantity: parseInt(quantity) * -1,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.status === 200) {
    Toastify({
      text: "Product removed from cart",
      backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      className: "info",
    }).showToast();
    user.cart = response.data;
    saveUserLocally(user);
    createCartProductGallery();
  } else {
    Toastify({
      text: "Error removing product from cart",
      backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      className: "info",
    }).showToast();
  }
}
async function createCartProductGallery() {
  let user;
  try {
    user = await getAccount();
  } catch (e) {
    console.log(e);
  }

  if (!user) {
    window.location.href = "/login";
    return;
  }
  $("#product-container").html("");
  if (user.cart.items.length === 0) {
    $("#category-title").html(`
    <div>
    <h2>Cart</h2>
    <hr/>
    <div id="cart-items">
      <h4>No items in cart</h4>
      <a href="/">Back home</a>
    </div>
    </div>`);
    return;
  }
  $("#category-title").text(`My Cart`);

  user.cart.items.forEach(function (cartProduct) {
    var cardHtml = cartProductCard(cartProduct);
    $("#product-container").append(cardHtml);
  });
  $("#product-container").append(`
    <button class="checkout-button" onclick="window.location.href='/checkout'">
      <span>Checkout</span>
      <i class="fa-solid fa-cart-shopping"></i>
    </button>
  `);
}
$("html, body").animate(
  {
    scrollTop: $("#product-container").offset().top - 10,
  },
  1000
);

createCartProductGallery();
