/**
 * Component props type definitions
 */

import { Movie } from './movie';

export interface ErrorAlertProps {
  message: string;
}

export interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onWatchlistToggle?: (movieId: number, movieTitle: string) => void;
  showRemoveButton?: boolean;
}

export interface MoviesGridProps {
  movies: Movie[];
  watchlist: number[];
  onWatchlistToggle: (movieId: number, movieTitle: string) => void;
  showRemoveButton?: boolean;
}
