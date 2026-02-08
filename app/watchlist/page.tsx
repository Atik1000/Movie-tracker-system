'use client';

import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getMoviesByIds } from '@/lib/tmdb';
import { Navigation } from '@/components/navigation';
import { MovieGridSkeleton } from '@/components/movie-skeleton';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useWatchlistActions } from '@/hooks/use-watchlist-actions';
import { useMovieLoader } from '@/hooks/use-movie-loader';
import { ErrorAlert } from '@/components/error-alert';
import { MoviesGrid } from '@/components/movies-grid';

export default function WatchlistPage() {
  const { user } = useRequireAuth();
  const { watchlist, toggleMovie } = useWatchlistActions({
    userEmail: user?.email,
  });
  const { data: watchlistMovies, isLoading, error, loadData } =
    useMovieLoader<Movie[]>();

  useEffect(() => {
    if (watchlist.length === 0) {
      loadData(async () => []);
      return;
    }
    loadData(() => getMoviesByIds(watchlist));
  }, [watchlist, loadData]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            My Watchlist
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {watchlistMovies?.length ?? 0}{' '}
            {watchlistMovies?.length === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>

        <ErrorAlert message={error} />

        {isLoading && <MovieGridSkeleton />}

        {!isLoading && watchlistMovies && watchlistMovies.length > 0 && (
          <MoviesGrid
            movies={watchlistMovies}
            watchlist={watchlist}
            onWatchlistToggle={toggleMovie}
            showRemoveButton
          />
        )}

        {!isLoading && watchlistMovies?.length === 0 && (
          <div className="py-12 sm:py-20 text-center px-4">
            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
              Start adding movies to keep track of what you want to watch
            </p>
            <Link href="/search">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base">
                Discover Movies
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
