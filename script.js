const movieApi = "24c5b19a49cfefbc4da219de97474cb3";
const giphyApi = "rGUKmT78evm9GztNgAdrUuRuYUOJ2ZXO";
const randomMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${movieApi}&language=en-US&page=1`;
const configUrl = `https://api.themoviedb.org/3/configuration?api_key=${movieApi}`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieApi}`;
const moviesList = document.querySelector(".movies-list");
const movieURL = "https://api.themoviedb.org/3";
const searchURL = movieURL + "/search/movie?"+ "api_key=" + movieApi;
const form = document.querySelector("form");
const output = document.querySelector("output");
const imgURL = "https://image.tmdb.org/t/p/w500/";
// Example API Request
// https://api.themoviedb.org/3/movie/550?api_key=24c5b19a49cfefbc4da219de97474cb3

// API Read Access Token (v4 auth)
//eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNGM1YjE5YTQ5Y2ZlZmJjNGRhMjE5ZGU5NzQ3NGNiMyIsInN1YiI6IjYyYTc3NWZkM2UyZWM4MDA5YmMwN2RjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.x4D22BLP3HHo2U9wp-1Q8imZQh--rXCf_2X2oV30jfo



const createMovies = (data) => {
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
            <a href="#" aria-id="id" class="vertical-gutter">
                <div class="overlay" aria-hidden="true"></div>
                <h3>${result.title}</h3>
                <img src="${data[0].images.secure_base_url}w500${result.poster_path}" alt="${result.title} poster"/>
                <ul class="genres-list">
                    ${genresString}
                </ul>
            </a>
        `;
        // let title = document.createElement("h3");
        // title.textContent = result.title;
        // let img = document.createElement("img");
        // img.setAttribute("src", `${data[0].images.secure_base_url}w500${result.poster_path}`);
        // img.setAttribute("alt", `${result.title} poster`);
        // let genresList = document.createElement("ul");
        // let genres = [];
        // for (let i = 0; i < result.genre_ids.length; i++) {
        //     data[1].genres.forEach(el => {
        //         if (el.id === result.genre_ids[[i]]) {
        //             genres.push(el);
        //         }
        //     })
        // } 
        // let genresItems = '';
        // genres.forEach(el => genresItems += `<li>${el.name}</li>`);
        // genresList.innerHTML = genresItems;
        movieItem.innerHTML = itemContent;
        moviesList.append(movieItem);
    });
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
    .then(res => {
        createMovies(res)
        console.log(res)})
    .catch(error => console.log(error))



    // search movies
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const search = document.getElementById("movie-name").value;

    fetchRequest(searchURL + "&query=" + search)
    .then((response) => {
        showMovie(response)
        console.log(response)})

        //hide random movies when searching
        document.querySelector("section").style.display = "none";

    //show searched movies
    const showMovie = (response) => {

            for (i=0; i < response.results.length; i++) {

        let title = document.createElement("h2");
            title.textContent = response.results[i].original_title;

        let img = document.createElement("img");
        img.src = imgURL + response.results[i].poster_path;
        img.alt= response.results[i].original_title;

        let overview = document.createElement("p");
        overview.textContent = response.results[i].overview;

        let lang = document.createElement("p");
        lang.textContent= "Original Language: " + response.results[i].original_language;

        let rating = document.createElement("p");
        rating.textContent = "Rating " + response.results[i].vote_average;

        //how do I use genre ID's?
        // let genre = document.createElement("p");
        // genre.textContent = "Genres: " + response.results[i].genre_ids;
        let genres = [];
        for (let i = 0; i < response.results[i].genre_ids.length; i++) {
            response.results[i].genre_ids.forEach(el => {
                if (el.id === response.results[i].genre_ids[[i]]) {
                    genres.push(el);
                }
            })
        } 
        let genresString = '';
        genres.forEach(el => genresString += `<p>${el.name}</p>`);
        output.append(title, img, overview, lang, rating, genres)
    }}
    showMovie.classList.add("vertical-gutter")
});


