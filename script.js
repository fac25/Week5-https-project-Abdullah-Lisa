//API keys
const movieApi = "24c5b19a49cfefbc4da219de97474cb3";
const giphyApi = "rGUKmT78evm9GztNgAdrUuRuYUOJ2ZXO";
// TMDB endpoints
const randomMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${movieApi}&language=en-US`;
const configUrl = `https://api.themoviedb.org/3/configuration?api_key=${movieApi}`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieApi}`;
const moviesByGenre = `https://api.themoviedb.org/3/discover/movie?api_key=${movieApi}`;
const movieURL = "https://api.themoviedb.org/3";
const searchURL = movieURL + "/search/movie?"+ "api_key=" + movieApi;
// Giphy endpiont
const giphyUrl = `https://api.giphy.com/v1/gifs/search`;
// HTML elements
const logo = document.querySelector(".logo");
const randomSection = document.querySelector(".movies");
const moviesList = document.querySelector(".movies-list");
const errorSection = document.querySelector(".error");
const errorMessage = document.querySelector(".error-message");
let movieSection = document.querySelector(".movie");
const form = document.querySelector("form");





const getMovie = (id) => {
    return Promise.all([fetchRequest(`https://api.themoviedb.org/3/movie/${id}?api_key=${movieApi}&language=en-US`), fetchRequest(configUrl)])
        .then(results => createMovie(results))
        .catch(error => handleError(error, "Sorry, something went wrong. Please try to refresh the page or visit us later"))
}

const handleGetMovie = (e, id) => {
    e.preventDefault();
    getMovie(id);
}

// Create a movie secton to display the movie data on it
const createMovie = (results) => {
    let details = results[0];
    let config = results[1];
    let genresString = ``;
    details.genres.forEach(genre => genresString += `<li><a href="#" data-id=${genre.id}>${genre.name}</a></li>`);
            randomSection.classList.add("hidden");
            let imgSrc = details.poster_path ? `${config.images.secure_base_url}w500${details.poster_path}` : "./images/placeholder.jpeg";
            let content = `
                <div class="container">
                    <div class="movie-grid">
                    <div class="movie-content vertical-gutter">
                        <h2>${details.title}</h2>
                        <ul class="movie-info">
                        <li>Release Date: <span>${details.release_date}</span></li>
                        <li>Ratings: ${details.vote_average}</li>
                        </ul>
                        <ul class="genres-list">
                            ${genresString}
                        </ul>
                        <p class="movie-descrption">${details.overview ? details.overview : "No description available."}</p>
                        <p class="movie-language">Language: <span>${details.original_language.toUpperCase()}.</span></p>
                    </div>
                    <div class="movie-img">
                        <img class="img" src="${imgSrc}" width="300" height="400" alt="${details.title} poster""/>
                    </div>
                    </div>
                </div>
                `
                movieSection.innerHTML = content;
                createBackButton(movieSection.querySelector(".container"), "afterbegin");
                addGenreLinks(movieSection);
                movieSection.classList.remove("hidden");
                movieSection.classList.add("show");
                getMovieGiphy(details.title);
}


// Create movies list content
const createMovies = (data) => {
    if (data[2].results.length === 0) {
        handleError(null, `Sorry, we couldn't find what you're looking for.`);
    } else {
        let items = '';
        data[2].results.forEach(result => {
            let genresString = createGenresList(data[1].genres, result.genre_ids);
            let imgSrc = result.poster_path ? `${data[0].images.secure_base_url}w500${result.poster_path}` : "./images/placeholder.jpeg";
            let itemContent = `
                <li>
                    <a href="#" data-id="${result.id}" class="vertical-gutter movie-link">
                        <div class="movie-content vertical-gutter">
                            <h3>${result.title}</h3>
                            <ul class="genres-list">
                                ${genresString}
                            </ul>
                        </div>
                        <img src="${imgSrc}" width="300" height="400" alt="${result.title} poster"/>
                    </a>
                </li>
            `;
            items += itemContent;
        });
        moviesList.innerHTML = items;
        showSection(randomSection);
        const movieLinks = document.querySelectorAll(".movie-link");
        movieLinks.forEach(movie => movie.addEventListener("click", (e) => handleGetMovie(e, movie.dataset.id)));
    }
    return randomSection.querySelector("h2");
    
}

// Get a giphy for a movie
const getMovieGiphy = (title) => {
    fetchRequest(`${giphyUrl}?q=${title}&api_key=${giphyApi}&limit=1&rating=g`)
                  .then(result => {
                    let content = movieSection.querySelector(".movie-content");
                    let giphy = document.createElement("img");
                    giphy.src = result.data[0].images.fixed_width.url;
                    giphy.alt = result.data[0].title;
                    giphy.height = "200";
                    giphy.width = "250";
                    content.append(giphy);
                  })
                  .catch(error => console.log(error));
}

// Create movies list from a specific genre
const getMoviesByGenre = (e, el) => {
    e.preventDefault();
    let id = el.dataset.id;
    createMoviesList(moviesByGenre + `&with_genres=${id}`)
        .then(title => title.textContent = `${el.textContent} Movies`)
        .catch(error => handleError(error, "Sorry, something went wrong. Please try to refresh the page or visit us later"));
}

// Crreate a list items from a genres array
const createGenresList = (genresArray, genresId) => {
    let genres = [];
            for (let i = 0; i < genresId.length; i++) {
                genresArray.forEach(el => {
                    if (el.id === genresId[[i]]) {
                        genres.push(el);
                    }
                })
            } 
            let genresString = '';
            genres.forEach(el => genresString += `<li>${el.name}</li>`);
            return genresString;
}

const createMoviesList = (url) => {
    return Promise.all([fetchRequest(configUrl), fetchRequest(genresUrl), fetchRequest(url)])
    .then(res => {console.log(res); return createMovies(res)})
}


const addGenreLinks = (section) => {
    section.querySelectorAll("[data-id]").forEach(link => link.addEventListener("click", (e) => getMoviesByGenre(e, link)))
}


// fetch template
const fetchRequest = (url) => {
    return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong with the request. code: ' + response.status);
            })
}

// Clicking the logo return to the landing page with random movies
logo.addEventListener("click", (e) => {
    e.preventDefault;
    createMoviesList(randomMoviesUrl + `&page=${Math.floor(Math.random() * 50)}`)
    .then(title => title.textContent = "Popular Movies")
    .catch(error => handleError(error, "Sorry, something went wrong. Please try to refresh the page or visit us later"))
})


// Create random movies when the page is loaded
createMoviesList(randomMoviesUrl + `&page=${Math.floor(Math.random() * 50)}`)
    .then(title => title.textContent = "Popular Movies")
    .catch(error => handleError(error, "Sorry, something went wrong. Please try to refresh the page or visit us later"));

// Show movie results for a search value
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const search = document.getElementById("movie-name");
    let searchVal = search.value;
    if (searchVal.trim() === "") {
        handleError(null, "Please don't leave the search field empty.");
        return;
    }

    createMoviesList(searchURL + `&query=${searchVal}`)
      .then(title => title.textContent = `Results for "${searchVal}"`)
      .catch(error => handleError(error, "Sorry, something went wrong. Please try to refresh the page or visit us later"))
    search.value = "";
});

// Create a button to return to the landing page
const createBackButton = (target, position) => {
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add(("button-container"));
    let button = document.createElement("button");
    button.textContent = "Back to movies";
    button.classList.add("movies-button");
    button.addEventListener("click", () => {
        createMoviesList(randomMoviesUrl + `&page=${Math.floor(Math.random() * 50)}`)
            .then(title => title.textContent = "Popular Movies")
            .catch(error => handleError(error, "Sorry, something went wrong. Please try to refresh the page or visit us later"))
    });
    buttonContainer.append(button);
    target.insertAdjacentElement(position, buttonContainer);

}

const handleError = (error, message) => {
    console.log(error);
    errorMessage.textContent = message;
    createBackButton(errorMessage, "beforeend");
    showSection(errorSection);
}

// Show the activated section
const showSection = (section) => {
    document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
    section.classList.remove("hidden");
    section.classList.add("show");
}

