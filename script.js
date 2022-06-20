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
// Example API Request
// https://api.themoviedb.org/3/movie/550?api_key=24c5b19a49cfefbc4da219de97474cb3

// API Read Access Token (v4 auth)
//eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNGM1YjE5YTQ5Y2ZlZmJjNGRhMjE5ZGU5NzQ3NGNiMyIsInN1YiI6IjYyYTc3NWZkM2UyZWM4MDA5YmMwN2RjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.x4D22BLP3HHo2U9wp-1Q8imZQh--rXCf_2X2oV30jfo



const createMovies = (data) => {
    data[2].results.forEach(result => {
        let movieItem = document.createElement("li");
        let title = document.createElement("h3");
        title.textContent = result.title;
        let img = document.createElement("img");
        img.setAttribute("src", `${data[0].images.secure_base_url}w500${result.poster_path}`);
        img.setAttribute("alt", `${result.title} poster`);
        let genresList = document.createElement("ul");
        let genres = [];
        for (let i = 0; i < result.genre_ids.length; i++) {
            data[1].genres.forEach(el => {
                if (el.id === result.genre_ids[[i]]) {
                    genres.push(el);
                }
            })
        } 
        let genresItems = '';
        genres.forEach(el => genresItems += `<li>${el.name}</li>`);
        genresList.innerHTML = genresItems;
        movieItem.append(title, img, genresList);
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
        // response.results.forEach(result =>{ 
            for (i=0; i < response.results.length; i++) {
        let title = document.createElement("h2");
            title.textContent = response.results[i].original_title;
        let img = document.createElement("img");
        // img.setAttribute("src", `${data[0].images.secure_base_url}w500${result.poster_path}`);
        // img.setAttribute("alt", `${result.title} poster`);
        img.src = response.results[i].poster_path;
        img.alt="";
        let overview = document.createElement("p");
        overview.textContent = response.results[i].overview;
        output.append(title, img, overview)
    }}
});


