import axios from 'axios'

export const categories = [
    {
        name: "trending",
        title: "Em Alta",
        isLarge: true,
    },
    {
        name: "netflixOriginals",
        title: "Originais Netflix",
        isLarge: false,
    },
    {
        name: "topRated",
        title: "Populares",
        isLarge: false,
    },
    {
        name: "comedy",
        title: "Comédias",
        isLarge: false,
    },  
    {
        name: "romances",
        title: "Romances",
        isLarge: false,
    },                
    {
        name: "documentaries",
        title: "Documentários",
        isLarge: false,
    }
]

export const getMoviesByCategoryName = async (name) => {
    try {
        const resp = await axios.get("http://localhost:8080/moviesByCategory", {
            headers: {
                'Authorization': sessionStorage.getItem("sessionID"),
                'Category': name
            }
        });
        return resp.data;
    } catch (error) {
        return error;
    }
}

export const getMoviesTv = async () => {
    try {
        const resp = await axios.get("http://localhost:8080/tvMovies", {
            headers: {
                'Authorization': sessionStorage.getItem("sessionID"),
            }
        });
        return resp.data;
    } catch (error) {
        return error;
    }
}