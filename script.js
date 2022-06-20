const movieApi = "24c5b19a49cfefbc4da219de97474cb3";
const giphyApi = "rGUKmT78evm9GztNgAdrUuRuYUOJ2ZXO";
const randomMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${movieApi}&language=en-US&page=1`;
const configUrl = `https://api.themoviedb.org/3/configuration?api_key=${movieApi}`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieApi}`;
// const getMovie = `https://api.themoviedb.org/3/movie/{movie_id}?api_key=${movieApi}&language=en-US`
const moviesList = document.querySelector(".movies-list");

const handleGetMovie = (e, id) => {
    e.preventDefault();
    getMovie(id);
}

const getMovie = (id) => {
    return fetchRequest(`https://api.themoviedb.org/3/movie/${id}?api_key=${movieApi}&language=en-US`)
        .then(details => console.log(details))
}

const createMovies = (data) => {
    console.log(data);
    data[2].results.forEach(result => {
        let movieItem = document.createElement("li");
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
            <a href="#" data-id="${result.id}" class="vertical-gutter movie-link">
                <div class="overlay" aria-hidden="true"></div>
                <h3>${result.title}</h3>
                <img src="${data[0].images.secure_base_url}w500${result.poster_path}" alt="${result.title} poster"/>
                <ul class="genres-list">
                    ${genresString}
                </ul>
            </a>
        `;
        movieItem.innerHTML = itemContent;
        moviesList.append(movieItem);
    });
    const movieLinks = document.querySelectorAll(".movie-link");
        movieLinks.forEach(movie => movie.addEventListener("click", (e) => handleGetMovie(e, movie.dataset.id)))
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






Promise.all([fetchRequest(configUrl), fetchRequest(genresUrl), fetchRequest(randomMoviesUrl)])
    .then(res => createMovies(res))
    .catch(error => console.log(error))
