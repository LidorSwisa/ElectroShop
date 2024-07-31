function addToCart(productId) {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  const product = showingItems.find((item) => item._id === productId);
  const id = product._id;
  const quantity = $(`#${id}_quantity`).val();
  $.ajax({
    url: "/cart/update",
    method: "PUT",
    data: { itemId: id, quantity: parseInt(quantity) },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    success: function (response) {
      if (response.status === 200) {
        showSuccessToast(product, quantity);
        user.cart = response.data;
        saveUserLocally(user);
      }
    },
    error: function (err) {
      console.error("Error adding to cart:", err);
    },
  });
}

function showSuccessToast(product, quantity) {
  Toastify({
    text: `Added ${quantity} ${product.name} to cart`,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

let showingItems = localStorage.getItem("products");
async function loadDefaultProducts() {
  const categpryFromQuery = new URLSearchParams(window.location.search).get("category");
  const category = categpryFromQuery ?? "accessories";
  if (showingItems) {
    showingItems = JSON.parse(showingItems);
    createProductGallery(category, showingItems);
  } else {
    try {
    const defaultProducts = await fetchAndRenderProducts(category);
    console.log(defaultProducts)
    showingItems = defaultProducts;
    localStorage.setItem("products", JSON.stringify(showingItems));
    }catch(e) {console.log(e)}
    
  }
}

loadDefaultProducts();
