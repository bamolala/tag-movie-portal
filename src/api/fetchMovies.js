export const fetchMovies = async (searchText, moviesCallback, errorCallback, finallyCallback) => {
    console.log({searchText, moviesCallback, errorCallback, finallyCallback}, "inside"); 
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${searchText}&apikey=b1ef107e&type=movie`);
        const data = await response.json();
        console.log({response})
        if (data.Response === 'True') {
            const movieDetailsPromises = data.Search.map((movie) => fetchMovieDetails(movie.imdbID, errorCallback));
            const movieDetails = await Promise.all(movieDetailsPromises);

            moviesCallback(movieDetails);
            errorCallback(null);
        } else {
            moviesCallback([]);
            errorCallback(data.Error);
        }
    } catch (err) {
        console.log({err})
        moviesCallback([]);
        errorCallback('An error occurred while fetching data.');
    } finally {
        finallyCallback()
    }
};

const fetchMovieDetails = async (id, errorCallback) => {
    console.log({id})
    try {
        const response = await fetch(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=b1ef107e`);
        console.log({response})
        const data = await response.json();

        if (data.Response === 'True') {
            return data;
        } else {
            throw new Error(data.Error);
        }
    } catch (err) {
        errorCallback('An error occurred while fetching movie details.');
    }
};
