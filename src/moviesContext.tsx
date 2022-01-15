import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "./services/api";

interface GenreResponseProps {
    id: number;
    name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
    title: string;
  }

  interface MoviesProviderProps{
      children: ReactNode
  }
   

  interface MoviesContextData{
    genres: GenreResponseProps[],
    selectedGenreId: number,
    selectedGenre: GenreResponseProps,
    movies: MovieProps[],
    handleClickButton:(id: number) => void
  }
  
  
  interface MovieProps {
    map(arg0: (movie: any) => JSX.Element): ReactNode;
    imdbID: string;
    Title: string;
    Poster: string;
    Ratings: Array<{
      Source: string;
      Value: string;
    }>;
    Runtime: string;
  }
  

const moviesContext = createContext<MoviesContextData>({} as MoviesContextData)

export function MoviesProvider({children}:MoviesProviderProps){

    const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return(
      
      <moviesContext.Provider value={{genres, selectedGenreId, selectedGenre, movies, handleClickButton}}>
          {children}
      </moviesContext.Provider>
  )
}

export function useMovies(){
    const context = useContext(moviesContext);

    return context

}

