const movieApi = "api_key=24c5b19a49cfefbc4da219de97474cb3"
const giphyApi = "rGUKmT78evm9GztNgAdrUuRuYUOJ2ZXO"

const movieURL = "https://api.themoviedb.org/3";
const searchURL = movieURL + "/search/movie?"+ movieApi;

const form = document.querySelector("form");
const search = document.getElementById("movie-name").value;

//example API request searching for dune
//https://api.themoviedb.org/3/search/movie?api_key=24c5b19a49cfefbc4da219de97474cb3&query=dune
 
// Example API Request
// https://api.themoviedb.org/3/movie/550?api_key=24c5b19a49cfefbc4da219de97474cb3



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


// fetchRequest(`https://api.themoviedb.org/3/movie/popular?api_key=${movieApi}&language=en-US&page=1`)
//     .then(movies =>  {
//         console.log(movies);
//         createMovies(movies)
//     })
//     .catch(error => console.log(error))



// search movies
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const movie = formData.get("movie-name");

    console.log(fetchRequest(searchURL + "&query=" + movie))
});