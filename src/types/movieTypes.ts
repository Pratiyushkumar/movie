export interface MovieBasic {
  imdbID: string;
  Title: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Plot: string;
  Director: string;
  Actors: string;
  Genre: string;
  Rating: string;
}

export interface MovieSearchResponse {
  Search: MovieBasic[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieListItemsProps {
  movie: MovieDetails;
  isLastElement: boolean;
  lastMovieElementRef: (node: HTMLDivElement | null) => void;
  toggleCardExpansion: (imdbID: string) => void;
  isExpanded: boolean;
}
