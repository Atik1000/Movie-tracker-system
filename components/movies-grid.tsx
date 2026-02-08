import { MoviesGridProps } from '@/types/components';
import { MovieCard } from './movie-card';

export function MoviesGrid({
  movies,
  watchlist,
  onWatchlistToggle,
  showRemoveButton = false,
}: MoviesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center sm:justify-items-stretch">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isInWatchlist={watchlist.includes(movie.id)}
          onWatchlistToggle={onWatchlistToggle}
          showRemoveButton={showRemoveButton}
        />
      ))}
    </div>
  );
}
