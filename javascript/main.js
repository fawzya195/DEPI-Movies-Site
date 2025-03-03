const API_KEY = "c52b0111f9bd1ea3ae972e3ecbadacf6";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const MOVIES_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const form = document.getElementById("form");
const container = document.querySelector(".movies");

const genreFilter = document.createElement("select");
const ratingFilter = document.createElement("input");
const sortBy = document.createElement("select");
const applyFiltersBtn = document.createElement("button");

// Add basic styles
genreFilter.className = "form-control mb-2 h-50 mx-2";
ratingFilter.className = "form-control mb-2 h-50 mx-2";
sortBy.className = "form-control mb-2 h-50 mx-2";
applyFiltersBtn.className = "btn btn-danger rounded-5 mb-2 ";

// Set input attributes
ratingFilter.type = "number";
ratingFilter.min = "0";
ratingFilter.max = "10";
ratingFilter.placeholder = "Minimum Rating";
applyFiltersBtn.textContent = "Filters";

// Append filters to the page
document.querySelector(".sortandfilter").prepend(genreFilter, ratingFilter, sortBy, applyFiltersBtn);

// Fetch and Display Genres
fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        genreFilter.innerHTML = '<option value="">All Genres</option>';
        data.genres.forEach(genre => {
            genreFilter.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
        });
    });

// Sorting Options
sortBy.innerHTML = `
    <option value="popularity.desc">Popularity (High to Low)</option>
    <option value="popularity.asc">Popularity (Low to High)</option>
    <option value="title.asc">Title (A-Z)</option>
    <option value="title.desc">Title (Z-A)</option>
    <option value="release_date.desc">Newest</option>
    <option value="release_date.asc">Oldest</option>
    <option value="vote_average.desc">Rating (High to Low)</option>
    <option value="vote_average.asc">Rating (Low to High)</option>
`;

// Fetch Movies
function getApi(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            container.innerHTML = "";
           displayMovie(data.results);
        });
}

// Display Movies
function displayMovie(data) {
    console.log(data);
    container.innerHTML = "";
    if(data !=""){
        data.forEach(element => {
            const movieList = document.createElement("div");
            movieList.classList.add("col-12", "col-sm-6", "col-md-4", "col-lg-3", "p-3");
            movieList.innerHTML = `
            <div class="card wow animate__animated animate__fadeInUp" onclick="redirectToDetails(${element.id})" style="cursor:pointer;">
                <img src="${IMAGE_BASE_URL + element.poster_path}" class="card-img-top img-fluid" alt="${element.title}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title d-inline">${element.title}</h5>
                        <b>${element.vote_average.toFixed(1)} <i class="fa-solid fa-star" style="color: #FFD43B;"></i></b>
                    </div>
                    <div class="card-text overview">
                        <p>Overview</p>
                        <p>${element.overview}</p>
                    </div>
                </div>
            </div>`;
            container.appendChild(movieList);
        });
    }else{
        container.innerHTML = `<h2 class="mt-5 m-auto" style="color: #fff; text-align: center;">Not Result Found !!</h2>`;

    }
}

// Function to redirect to movie details page
function redirectToDetails(movieId) {
    window.location.href = `movie-details.html?id=${movieId}`;
}


// Apply Sorting & Filtering
applyFiltersBtn.addEventListener("click", () => {
    let selectedGenre = genreFilter.value;
    let minRating = ratingFilter.value;
    let sortOption = sortBy.value;

    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortOption}`;

    if (selectedGenre) url += `&with_genres=${selectedGenre}`;
    if (minRating) url += `&vote_average.gte=${minRating}`;

    getApi(url);
});

// Search Functionality (keeps working)
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputValue = form.search.value;
    const SEARCH_URL = `${BASE_URL}/search/movie?query=${inputValue}&api_key=${API_KEY}`;
    getApi(SEARCH_URL);
    form.search.value = "";
});

// Load Movies Initially
getApi(MOVIES_URL);


// configration of passward in  sighup
function validate() {
  var pass=document.getElementById("signupPassword").value;
  var config=document.getElementById("confirmPassword").value;
  var result=document.getElementById("error");
  var email = document.getElementById("signupEmail").value;
  var loginOutBtn = document.getElementById("login/out-btn");

  if(pass!==config)
    {
        result.innerHTML=" No matching password !";
        return false;
    }
    else if (localStorage.getItem(email)){
      result.innerHTML="Email already exists ! Please login";
      return false;

    }
    else{
      var userData = { email: email, password: pass };
      localStorage.setItem(email, JSON.stringify(userData));
      loginOutBtn.innerHTML = "Logout";
        return true;
    }
  
}

//authontication in login

function auth(){
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;
  var error = document.getElementById("loginError");
  var userData = localStorage.getItem(email);
  var loginOutBtn = document.getElementById("login/out-btn");

  if (!userData) {
    error.innerHTML = "This account not found ! Signup first";
    return false;
}
else{

  userData = JSON.parse(userData);
   if(userData.password !== password){
    error.innerHTML = "Wrong Password !"; 
    return false;
  }
  else{
    sessionStorage.setItem("loggedInUser", email);
    loginOutBtn.innerHTML = "Logout";
    return true;
  }
}


}
//change button bettwen login and logout
document.addEventListener("DOMContentLoaded", function () {
    const loginOutBtn = document.getElementById("login/out-btn");
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (loggedInUser) {
        loginOutBtn.innerHTML = "Logout";
    } else {
        loginOutBtn.innerHTML = "Login";
    }

    loginOutBtn.addEventListener("click", function () {
        if (sessionStorage.getItem("loggedInUser")) {
            sessionStorage.removeItem("loggedInUser");
            loginOutBtn.innerHTML = "Login"; 
            window.location.reload();
        }
    });
});


