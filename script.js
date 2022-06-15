const movieApi = "24c5b19a49cfefbc4da219de97474cb3";
const giphyApi = "rGUKmT78evm9GztNgAdrUuRuYUOJ2ZXO";
const randomMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${movieApi}&language=en-US&page=1`;
const configUrl = `https://api.themoviedb.org/3/configuration?api_key=${movieApi}`;
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieApi}`;
const moviesList = document.querySelector(".movies-list");
// Example API Request
// https://api.themoviedb.org/3/movie/550?api_key=24c5b19a49cfefbc4da219de97474cb3

// API Read Access Token (v4 auth)
//eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNGM1YjE5YTQ5Y2ZlZmJjNGRhMjE5ZGU5NzQ3NGNiMyIsInN1YiI6IjYyYTc3NWZkM2UyZWM4MDA5YmMwN2RjNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.x4D22BLP3HHo2U9wp-1Q8imZQh--rXCf_2X2oV30jfo




const createMovies = (movies) => {
    movies.results.forEach(result => {
        let movieItem = document.createElement("li");
        let title = document.createElement("h3");
        title.textContent = result.title;
        let img = document.createElement("img");
        img.setAttribute("src", `https://image.tmdb.org/t/p/w500${result.poster_path}`);
        img.setAttribute("alt", `${result.title} poster`);
        let overview = document.createElement("p");
        overview.textContent = result.overview;
        movieItem.append(title, img, overview);
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





fetchRequest(`https://api.themoviedb.org/3/movie/popular?api_key=${movieApi}&language=en-US&page=1`)
    .then()
    .catch(error => console.log(error))