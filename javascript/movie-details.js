const API_KEY = "c52b0111f9bd1ea3ae972e3ecbadacf6";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const movieDetailsContainer = document.getElementById("movie-details");

// استخراج ID الفيلم من الرابط
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// التحقق من أن هناك ID قبل تنفيذ الطلب
if (movieId) {
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`)
        .then(res => res.json())
        .then(data => {
            displayMovieDetails(data);
        })
        .catch(err => console.error("Error fetching movie details:", err));
} else {
    movieDetailsContainer.innerHTML = "<p>Movie not found.</p>";
}

// دالة لعرض تفاصيل الفيلم
function displayMovieDetails(movie) {
    const trailer = movie.videos.results.find(video => video.type === "Trailer");

    movieDetailsContainer.innerHTML = `
        <div class="movie-card row px-2">
            <img class="img-fluid col-md-3" src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
            ${trailer ? `<iframe class="col-md-9" width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>` : "<p>No trailer available.</p>"}
            <h2 class="col-md-12 my-4">${movie.title}</h2>
             <p><strong>Genre:</strong> ${movie.genres.map(genre => genre.name).join(", ")}</p>
            <p><strong>Duration:</strong> ${movie.runtime} minutes</p>
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <p><strong>Cast:</strong> ${movie.credits.cast.slice(0, 5).map(actor => actor.name).join(", ")}</p>
            <p><strong>Rating:</strong> ${movie.vote_average} / 10</p>
        </div>
    `;
}
