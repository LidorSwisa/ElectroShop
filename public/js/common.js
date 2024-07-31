function isFavorite(product) {
  if(!user) return false
  return user.favorites.findIndex((fav) => fav._id === product._id) !== -1;
}
function productCard(product, inFavoritesPage = false) {
  return `
  <div class="product-card" id="product_card_${product._id}">
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
          <div class="card-add-to-cart">
              <input id="${
                product._id
              }_quantity" style="width: 100px; height:30px;" type="number" min="1" value="1"></input>
              <button class="btn-buy" onclick="addToCart('${product._id}')">Add to cart</button>
              <div id="fav_item_${product._id}">
              ${
                isFavorite(product)
                  ? `<i class="fa-solid fa-heart inFav_${product._id}" onclick="removeFromFavorites('${product._id}', ${inFavoritesPage})"></i>`
                  : `<i class="fa-regular fa-heart notInFav_${product._id}" onclick="addToFavorites('${product._id}')"></i>`
              }
              </div>
          </div>
      </div>
  </div>
`;
}

function removeFromFavorites(productId, inFavoritesPage = false) {
  $.ajax({
    url: "/auth/toggleFavorite",
    method: "PUT",
    data: {
      productId,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        user.favorites = response.data.favorites;
        saveUserLocally(user);

        Toastify({
          text: "Removed from favorites",
          backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
          className: "info",
        }).showToast();
        if (inFavoritesPage) {
          $(`#product_card_${productId}`).remove();
        } else {
          $(`#fav_item_${productId}`).html(
            `<i class="fa-regular fa-heart notInFav_${productId}" onclick="addToFavorites('${productId}')"></i>`
          );
        }
      }
    },
    error: function (err) {
      console.error("Error removing from favorites:", err);
    },
  });
}

function addToFavorites(productId) {
  $.ajax({
    url: "/auth/toggleFavorite",
    method: "PUT",
    data: {
      productId,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        user.favorites = response.data.favorites;
        saveUserLocally(user);
        Toastify({
          text: "Added to favorites",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          className: "info",
        }).showToast();
        $(`#fav_item_${productId}`).html(
          `<i class="fa-solid fa-heart inFav_${productId}" onclick="removeFromFavorites('${productId}')"></i>`
        );
      }
    },
    error: function (err) {
      console.error("Error adding to favorites:", err);
    },
  });
}
function createProductGallery(category, products, inFavoritesPage = false) {
  $("#category-title").text(`Category: ${category}`);

  const $container = $("#product-container");
  $container.empty();

  products.forEach(function (product) {
    const $card = $(productCard(product, inFavoritesPage));
    $container.append($card);
  });
}
async function fetchCategoryProducts(category) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/products/?category=${category}`,
      method: "GET",
      success: function (response) {
        if (response.status === 200) {
          resolve(response.data);
        }
      },
      error: function (err) {
        console.error("Error fetching data:", err);
        reject(err);
      },
    });
  });
}

function saveUserLocally(u) {
  user = u;
  $("#cart-count").text(u.cart.items.length);
  sessionStorage.setItem("user", JSON.stringify(u));
}

async function fetchAndRenderProducts(category) {
  const defaultProducts = await fetchCategoryProducts(category.replace(" ", "%20"));
  showingItems = defaultProducts;
  createProductGallery(category, defaultProducts);
  // smooth scroll down
  $("html, body").animate(
    {
      scrollTop: $("#category-title").offset().top - 10,
    },
    500
  );
  return defaultProducts;
}

async function getCategoriesLocally() {
  return new Promise((resolve, reject) => {
    let interval;
    let attempts = 0;
    interval = setInterval(() => {
      if (attempts >= 20) {
        clearInterval(interval);
        return reject("Timeout");
      }
      if (categories && categories.length > 0) {
        clearInterval(interval);
        return resolve(categories);
      }
    }, 400);
  });
}

async function getAccount() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login";
    return;
  }
  return new Promise((resolve, reject) => {
    let interval;
    let attempts = 0;
    interval = setInterval(() => {
      if (attempts >= 20) {
        clearInterval(interval);
        return reject("Timeout");
      }
      if (user) {
        clearInterval(interval);
        return resolve(user);
      }
    }, 400);
  });
}
