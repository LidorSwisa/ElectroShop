const categoriesMenu = $("#menu-categories");
const myAccountMenu = $("#my-account-menu ");
const myAccountMenuInner = $("#my-account-menu-inner");
myAccountMenuInner.html(`<div><a href="/login">Login</a><a href="/register">Register</a></div>`);
// Menu controls
let isMyAccountMenuShowing = false;
function showAllCategoriesMenu() {
  categoriesMenu.fadeIn(150);
}
function hideAllCategoriesMenu() {
  categoriesMenu.fadeOut(150);
}

function showMyAccountMenu() {
  if (!isMyAccountMenuShowing) {
    myAccountMenuInner.fadeIn(150);
  } else {
    myAccountMenuInner.fadeOut(150);
  }
  isMyAccountMenuShowing = !isMyAccountMenuShowing;
}

$("#all-categories").on("mouseenter", showAllCategoriesMenu);
$("#all-categories").on("mouseleave", hideAllCategoriesMenu);

myAccountMenu.on("click", showMyAccountMenu);

// Search bar
const searchBar = $("#search-bar-input");
const searchSubmit = $("#search-submit");

searchSubmit.on("click", () => {
  const searchValue = searchBar.val();
  if (searchValue.replace(/\s+/g, "").length < 1) {
    return;
  }
  window.location.href = `/search?query=${searchValue}`;
});



// Fetch and render weather conditions for tel aviv
const renderWeather = (weather) => {

 // take only the important stuff (temp, condition, wind, humidity)
  const { temp_c, condition, wind_kph, humidity } = weather;

  const icon = condition.icon; ////cdn.weatherapi.com/weather/64x64/day/113.png
  const iconUrl = `http:${icon}`;

  const weatherContainer = $("#weather");
  weatherContainer.html(
    `
    <b>Weather in Tel Aviv</b>
    <img src="${iconUrl}" alt="weather icon" />
    <b>
      <p>${temp_c}°C</p>
      <p>${condition.text}</p>
    </b>
    `
  );

}
const getWeather = () => {
  const lastInvalidationDate = localStorage.getItem("weather-invalidation");
  if (lastInvalidationDate) {
    const now = new Date();
    const diff = now - new Date(lastInvalidationDate);
    if (diff < 1000 * 60 * 60) {
      renderWeather(JSON.parse(localStorage.getItem("weather")));
      return;
    }
  }
  const url =
    "http://api.weatherapi.com/v1/current.json?key=4c9dc578e5184056bfd131803242807&q=Tel%20Aviv&aqi=no";
  $.ajax({
    url,
    method: "GET",
    success: function (response) {
      if (response.error) {
        console.error("Error fetching weather data:", response.error);
        return;
      }
      const { current } = response;
      localStorage.setItem("weather", JSON.stringify(current));
      localStorage.setItem("weather-invalidation", new Date().toISOString());
      renderWeather(current);
    },
    error: function (err) {
      console.error("Error fetching weather data:", err);
    },
  });
};
// Fetch and render product categories
let categories = [];
const getCategories = () => {
  // Get all the product categories
  $.ajax({
    url: "/products/categories",
    method: "GET",
    success: function (response) {
      if (response.status === 200) {
        categories = response.data;
        categoriesMenu.html("");
        categoriesMenu.append(
          categories.map((c) =>
            $(`<p id="${c._id}" class="selectable">${c.name}</p>`)
              .text(`${c.name}`)
              .on("click", () => {
                if (window.location.pathname !== "/") {
                  window.location.href = `/?category=${c.name}`;
                  return;
                }
                fetchAndRenderProducts(c.name);
                categoriesMenu.fadeOut(150);
              })
          )
        );
      }
    },
    error: function (err) {
      console.error("Error fetching data:", err);
    },
  });
};
getCategories();
getWeather()
// Holds the user data
let user;

function logout() {
  const doit = confirm("Are you sure you want to log out?");
  if (doit) {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    alert("Logged out, see you next time!");
    window.location.reload();
  }
}
function authenticatedDesign() {
  if (!user) {
    myAccountMenuInner.html(
      `<div><a href="/login">Login</a><a href="/register">Register</a></div>`
    );
    return;
  }
  myAccountMenuInner.html(
    `<div style="min-width: 100px;"><p style="width:max-content;" onclick="(() => {  if(window.location.pathname !== '/account' && user) window.location.href='/account' })()"> Account (${user.name})</p><p onclick="logout()">Log out</p></div>`
  );
  if (user.isAdmin) {
    $(".toolbar-menu").append(`
     <div class="toolbar-item">
     <i class="fa-solid fa-lock"></i>
     <a href="/_admin">Administration</a>
   </div>
     `);
  }
}

// fetch the user data
function fetchUser() {
  // Check if user is in session
  let userFromSession = sessionStorage.getItem("user");
  if (userFromSession) {
    saveUserLocally(JSON.parse(userFromSession));
    if (user) {
      authenticatedDesign();
      return;
    }
  }
  // Check if user token is in local storage
  const token = localStorage.getItem("token");
  // Fetch user data if token is present
  if (token) {
    $.ajax({
      url: "/auth/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      contentType: "application/json",
      success: function (response) {
        console.log(response);
        if (response.status === 200) {
          const { data } = response;
          saveUserLocally(data);
          authenticatedDesign();
        }
      },
      error: function (err) {
        authenticatedDesign();
        console.log(err);
      },
    });
  }
}

// Fetch user data
fetchUser();
