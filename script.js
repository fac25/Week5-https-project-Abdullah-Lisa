const movieApi = "24c5b19a49cfefbc4da219de97474cb3";
const giphyApi = "rGUKmT78evm9GztNgAdrUuRuYUOJ2ZXO";
const randomMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${movieApi}&language=en-US`;
const configUrl = `https://api.themoviedb.org/3/configuration?api_key=${movieApi}`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieApi}`;
const giphyUrl = `https://api.giphy.com/v1/gifs/search`;
const logo = document.querySelector(".logo");
const randomSection = document.querySelector(".movies");
const moviesList = document.querySelector(".movies-list");
let movieSection = document.querySelector(".movie");

const handleGetMovie = (e, id) => {
    e.preventDefault();
    getMovie(id);
}

const getMovie = (id) => {
    return Promise.all([fetchRequest(`https://api.themoviedb.org/3/movie/${id}?api_key=${movieApi}&language=en-US`), fetchRequest(configUrl)])
        .then(results => createMovie(results))
        .catch()
}


const createMovie = (results) => {
    let details = results[0];
    let config = results[1];
    let genresString = ``;
    details.genres.forEach(genre => genresString += `<li>${genre.name}</li>`);
    fetchRequest(`${giphyUrl}?q=${details.title}&api_key=${giphyApi}&limit=1&rating=g`)
        .then(result => {
            randomSection.classList.add("hidden");
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
                        <p class="movie-descrption">${details.overview}</p>
                        <p class="movie-language">Language: <span>${details.original_language.toUpperCase()}</span></p>
                        <img src=${result.data[0].images.fixed_width.url} alt=${result.data[0].title} />
                    </div>
                    <div class="movie-img">
                        <img class="img" src="${config.images.secure_base_url}w500${details.poster_path}" width="100" alt="${details.title} poster""/>
                    </div>
                    </div>
                </div>
                `
                movieSection.innerHTML = content;
                movieSection.classList.remove("hidden");
                movieSection.classList.add("show");
        })
}

const createMovies = (data) => {
    let items = '';
    data[2].results.forEach(result => {
        let genres = [];
        for (let i = 0; i < result.genre_ids.length; i++) {
            data[1].genres.forEach(el => {
                if (el.id === result.genre_ids[[i]]) {
                    genres.push(el);
                }
            })
        } 
        let genresString = '';
        genres.forEach(el => genresString += `<li>${el.name}</li>`);
        let itemContent = `
            <li>
                <a href="#" data-id="${result.id}" class="vertical-gutter movie-link">
                    <div class="movie-content vertical-gutter">
                        <h3>${result.title}</h3>
                        <ul class="genres-list">
                            ${genresString}
                        </ul>
                    </div>
                    <img src="${data[0].images.secure_base_url}w500${result.poster_path}" alt="${result.title} poster"/>
                </a>
            </li>
        `;
        items += itemContent;
    });
    moviesList.innerHTML = items;
    movieSection.classList.add("hidden");
    randomSection.classList.remove("hidden");
    randomSection.classList.add("show");
    const movieLinks = document.querySelectorAll(".movie-link");
        movieLinks.forEach(movie => movie.addEventListener("click", (e) => handleGetMovie(e, movie.dataset.id)))
}

const createRandomMovies = () => {
    Promise.all([fetchRequest(configUrl), fetchRequest(genresUrl), fetchRequest(randomMoviesUrl + `&page=${Math.floor(Math.random() * 50)}`)])
    .then(res => createMovies(res))
    .catch(error => console.log(error))
}


const fetchRequest = (url) => {
    return fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong with request code: ' + response.status);
            })
}


logo.addEventListener("click", (e) => {
    e.preventDefault;
    createRandomMovies();
})



createRandomMovies();
