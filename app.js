const API_KEY = "67a45e1e"; // replace this

const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const historyBox = document.getElementById("history");
function showLoading(show) {
    loading.classList.toggle("hidden", !show);
}
function showError(show) {
    error.classList.toggle("hidden", !show);
}
function saveHistory(query) {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Add new search at start
    history.unshift(query);

    history = history.slice(0, 5);

    localStorage.setItem("history", JSON.stringify(history));

    displayHistory();
}
function displayHistory() {
    const history = JSON.parse(localStorage.getItem("history")) || [];

    historyBox.innerHTML = "<h3>Recent Searches:</h3>";

    history.forEach(item => {
        historyBox.innerHTML += `<p onclick="searchFromHistory('${item}')">${item}</p>`;
    });
}
function searchFromHistory(query) {
    searchInput.value = query;
    searchMovies();
}
async function searchMovies() {
    const query = searchInput.value.trim();
    // searchInput.value = "";
    if (!query) return;

    showLoading(true);
    showError(false);
    results.innerHTML = "";
    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
        const data = await res.json();

        if (data.Response === "False") {
            showError(true);
            return;
        }

        displayMovies(data.Search);
        saveHistory(query);

    } catch (err) {
        showError(true);
    } finally {
        showLoading(false);
    }
}
function displayMovies(movies) {
    results.innerHTML = "";

    movies.forEach(movie => {
        results.innerHTML += `
            <div class="movie">
                <img src="${movie.Poster}" width="100%">
                <h4>${movie.Title}</h4>
                <p>${movie.Year}</p>
            </div>
        `;
    });
}
displayHistory();
