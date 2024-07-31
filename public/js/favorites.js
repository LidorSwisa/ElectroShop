async function renderFavoritesPage() {
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

  const favorites = user.favorites;

  if (favorites.length === 0) {
    $("#product-container").html("<h1>No favorites found</h1>");
    return;
  }

  createProductGallery("Favorites", favorites, true /* in favorites page */);
}

$("html, body").animate(
  {
    scrollTop: $("#product-container").offset().top - 10,
  },
  1000
);
renderFavoritesPage();
