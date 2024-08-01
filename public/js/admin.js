async function renderAdminPage() {
  const account = await getAccount();
  if (!account || !account.isAdmin) {
    Toastify({
      text: "You are not an admin",
      backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
      className: "info",
    }).showToast();
    window.location.href = "/";
  }
  const categories = await getCategoriesLocally();

  $("#admin-container").html(`
    <div class="admin-grid">

    <div style="width:fit-content; padding: 1rem;">
        <h2>Admin</h2>
        <form id="create-category-form" onsubmit="createCategory(event)">
            <h3>Create category</h3>
            <input type="text" name="name" placeholder="Category name" required />
            <button type="submit">Create</button>
        </form>


        <form id="create-product-form" onsubmit="createProduct(event)">
            <h3>Create product</h3>
            <label>Product Name</label>
            <input type="text" name="name" placeholder="Product name" required />
            <label>Product Description</label>
            <input type="text" name="description" placeholder="Product description" required />
            <label>Product Brand</label>
            <input type="text" name="brand" placeholder="Product brand" required />
            <label>Product Category</label>
            <select style="padding:.5rem;" name="category">
            <option value="" disabled selected>Select category</option>
            ${categories.map((c) => `<option value="${c.name}">${c.name}</option>`).join("")}
            </select>
            <label>Product Price</label>
            <input type="number" name="price" placeholder="Product price" required />
            <label>Product Currency</label>
            <input type="text" name="currency" placeholder="Product currency" required />
            <label>Product Availability</label>
            <input type="text" name="availability" placeholder="Product availability" required />
            <label>Product Warranty</label>
            <input type="text" name="warranty" placeholder="Product warranty" required />
            <label>Product Tags ( seperated by commas )</label>
            <input type="text" name="tags" placeholder="Product tags" required />
            <label>Product images</label>
            <input type="file" multiple name="images" placeholder="Product images" required />
            <button type="submit">Create</button>
            <div id="create-product-error" style="display:none;"></div>
        </form>
    </div>

    <div class="admin-section-queries">
        <div class="admin-advanced-search">

        <button onclick="getAverageOrderTotal()">
          Show average order total
        </button>
        <button onclick="getUsersWithMoreThanFiveOrders()">
          Show users with more than 5 orders
        </button>

        <button onclick="getUsersWithMoreThanFiveItemsInCart()">
        Show users with more than 5 items in their cart
        </button>

        <button onclick="getUsersWithMoreThanFiveItemsInCart()">
                Show the average order value for orders that contain more than 3 items
         </button>
        <div class="admin-advanced-search-results">
            <div class="admin-users">
            </div>
        </div>
        </div>
        <div class="admin-graphs">

          <h4>All Product Sales</h4>

          <canvas id="sales-graph">
          </canvas>
          <h4>Product sales and revenue by category</h4>
          <canvas id="sales-graph-by-category">
          </canvas>
        </div>
    </div>
    </div>
  `);
  getAllProductSales();
  getSalesByCategory();
}

function getSalesByCategory() {
  $.ajax({
    url: "/admin/getSalesByCategory",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        const { data } = response;
        const ctx = document.getElementById("sales-graph-by-category").getContext("2d");
        if (graphByCategory) {
          graphByCategory.destroy();
        }
        graphByCategory = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.map((d) => d.categoryName),
            datasets: [
              {
                label: "Total Sold",
                data: data.map((d) => d.totalSold),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
              {
                label: "Total Revenue",
                data: data.map((d) => d.totalRevenue),
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
          },
        });
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
    },
  });
}

let graphByCategory;
let graph;
function getAllProductSales() {
  $.ajax({
    url: "/admin/getAllProductSales",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        const { data } = response;
        const ctx = document.getElementById("sales-graph").getContext("2d");
        console.log(data);
        if (graph) {
          graph.destroy();
        }
        graph = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.map((d) => d.productName),
            datasets: [
              {
                label: "Total Sold",
                data: data.map((d) => d.totalSold),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
    },
  });
}

function getAverageOrderTotal() {
  $.ajax({
    url: "/admin/getAverageOrderTotal",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        const { data } = response;
        $(".admin-advanced-search-results").html(`<h3>Average order total: $${data}</h3>`);
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
    },
  });
}

function getUsersWithMoreThanFiveOrders() {
  $.ajax({
    url: "/admin/getUsersWithMoreThanFiveOrders",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        const { data } = response;
        let dataStr = `
            ${
              data && data.length > 0
                ? data.map((d) => `<p>${d.email}</p>`).join("")
                : "<br/>No users found"
            }
        `;
        $(".admin-advanced-search-results").html(
          `<h3>Users with more than 5 orders: ${dataStr}</h3>`
        );
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
    },
  });
}

function getUsersWithMoreThan100Spent() {
  $.ajax({
    url: "/admin/getUsersWithMoreThan100Spent",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        const { data } = response;
        let dataStr = `
            ${
              data && data.length > 0
                ? data.map((d) => `<p>${d.email}</p>`).join("")
                : "<br/>No users found"
            }
        `;
        $(".admin-advanced-search-results").html(
          `<h3>Users with more than $100 spent: ${dataStr}</h3>`
        );
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
    },
  });
}

function getUsersWithMoreThanFiveItemsInCart() {
  $.ajax({
    url: "/admin/getUsersWithMoreThanFiveItemsInCart",
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 200) {
        const { data } = response;
        let dataStr = `
            ${
              data && data.length > 0
                ? data.map((d) => `<p>${d.email}</p>`).join("")
                : "<br/>No users found"
            }
        `;
        $(".admin-advanced-search-results").html(
          `<h3>Users with more than 5 items in cart: ${dataStr}</h3>`
        );
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
    },
  });
}

function createCategory(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());
  $.ajax({
    url: "/admin/createCategory",
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      if (response.status === 201) {
        Toastify({
          text: "Category created",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          className: "info",
        }).showToast();
        form.reset();
        getCategories();
      }
    },
    error: function (err) {
      console.error("Error creating category:", err);
    },
  });
}

function createProduct(event) {
  event.preventDefault();
  const form = event.target;
  const fileInput = form.querySelector('input[type="file"]');
  const data = Object.fromEntries(new FormData(form).entries());

  // Create a FormData object to hold all the files
  const formData = new FormData();

  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append("file", fileInput.files[i]);
  }

  // Upload images
  $.ajax({
    url: "/imageupload/upload",
    method: "POST",
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      if (response.status === 201) {
        // Assuming the response contains an array of uploaded image URLs
        const images = response.data.map((img) => ({
          url: img.url,
        }));

        data.images = images;
        data.price = {
          amount: parseFloat(data.price),
          currency: data.currency,
          discount: 0,
        };
        delete data.currency;

        if (data.tags) {
          data.tags = data.tags.split(",");
        }

        // Create the product with the uploaded image URLs
        $.ajax({
          url: "/admin/createProduct",
          method: "POST",
          data: JSON.stringify(data),
          contentType: "application/json",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          success: function (response) {
            if (response.status === 201) {
              Toastify({
                text: "Product created",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                className: "info",
              }).showToast();
              form.reset();
            }
          },
          error: function (err) {
            console.error("Error creating product:", err);
            try {
              const { error } = JSON.parse(err.responseText);
              if (typeof error == "object" && !error.message) {
                const errorMapped = error.map((e) => e.message).join("\n");
                $("#create-product-error").text(errorMapped);
              } else if (error.message) {
                $("#create-product-error").text(error.message);
              } else {
                $("#create-product-error").text(error);
              }
              console.error("Error fetching data:", err);
            } catch (e) {
              $("#create-product-error").text(err);
            }
          },
        });
      }
    },
    error: function (err) {
      console.error("Error uploading images:", err);
      try {
        const { error } = JSON.parse(err.responseText);
        if (typeof error == "object" && !error.message) {
          const errorMapped = error.map((e) => e.message).join("\n");
          $("#create-product-error").text(errorMapped);
        } else if (error.message) {
          $("#create-product-error").text(error.message);
        } else {
          $("#create-product-error").text(error);
        }
        console.error("Error fetching data:", err);
      } catch (e) {
        $("#create-product-error").text(err);
      }
    },
  });
}
renderAdminPage();
