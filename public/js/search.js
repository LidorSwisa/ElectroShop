const q = window.location.search;
const loading = $("#loading");
const error = $("#error");
const resultsHolder = $("#results-header");
if (!q) {
  // no query entered?
  window.location.href = "/";
} else {
  const normalizedQuery = q.replace("?query=", "");
  $.ajax({
    url: `/products/search?query=${normalizedQuery}`,
    method: "GET",
    contentType: "application/json",
    success: function (response) {
      loading.hide();
      resultsHolder.html(`<h2>Search results for: ${normalizedQuery}</h2>`);
      if (response.status === 200) {
        const { data } = response;
        if (!data || data.length === 0) {
          error.html(`
                        <h2 class="padded information">
                        Sorry, we couldn't find any products matching your search.
                            <span onclick="window.location.href = '/';" style="cursor: pointer; color: blue;">Go back to the main page</span>
                        </h2>`);
          error.show();
        } else createProductGallery("Search", data);
      }
    },
    error: function (err) {
      loading.hide();
      error.html(`
                    <h2>
                    Sorry, we couldn't find any products matching your search.
                        <span onclick="window.location.href = '/';" style="cursor: pointer; color: blue;">Go back to the main page</span>
                    </h2>`);
      error.show();
    },
  });
}
