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
import { motion } from 'framer-motion';

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
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            My Watchlist
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {watchlistMovies?.length ?? 0}{' '}
            {watchlistMovies?.length === 1 ? 'movie' : 'movies'} saved
          </motion.p>
        </motion.div>

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
          <motion.div
            className="py-12 sm:py-20 text-center px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mx-auto mb-4" />
            </motion.div>
            <motion.h3
              className="text-xl sm:text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your watchlist is empty
            </motion.h3>
            <motion.p
              className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Start adding movies to keep track of what you want to watch
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/search">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-2 rounded-lg text-sm sm:text-base">
                  Discover Movies
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
