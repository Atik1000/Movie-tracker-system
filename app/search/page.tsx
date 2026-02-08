'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Movie } from '@/types/movie';
import { searchMovies, getPopularMovies } from '@/lib/tmdb';
import { Navigation } from '@/components/navigation';
import { MovieGridSkeleton } from '@/components/movie-skeleton';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useWatchlistActions } from '@/hooks/use-watchlist-actions';
import { useMovieLoader } from '@/hooks/use-movie-loader';
import { ErrorAlert } from '@/components/error-alert';
import { MoviesGrid } from '@/components/movies-grid';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const { user } = useRequireAuth();
  const { watchlist, toggleMovie } = useWatchlistActions({
    userEmail: user?.email,
  });
  const { data: movies, isLoading, error, loadData, setData } =
    useMovieLoader<Movie[]>();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadInitialMovies = useCallback(async () => {
    const response = await getPopularMovies(1);
    setData(response.results);
    setCurrentPage(1);
    setTotalPages(response.total_pages);
  }, [setData]);

  useEffect(() => {
    if (user) {
      loadInitialMovies();
    }
  }, [user, loadInitialMovies]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setHasSearched(false);
      setCurrentPage(1);
      loadInitialMovies();
      return;
    }

    setHasSearched(true);
    setCurrentPage(1);
    loadData(async () => {
      const response = await searchMovies(query, 1);
      setTotalPages(response.total_pages);
      return response.results;
    });
  };

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || currentPage >= totalPages) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = hasSearched
        ? await searchMovies(searchQuery, nextPage)
        : await getPopularMovies(nextPage);

      setData((prev) => [...(prev ?? []), ...response.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more movies:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    isLoadingMore,
    currentPage,
    totalPages,
    hasSearched,
    searchQuery,
    setData,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMore &&
          currentPage < totalPages
        ) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleLoadMore, isLoadingMore, currentPage, totalPages]);

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
            className="text-2xl sm:text-3xl font-bold mb-2 text-balance"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome, {user.email.split('@')[0]}
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {hasSearched ? 'Search Results' : 'Discover popular movies'}
          </motion.p>
        </motion.div>

        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="relative group">
            <motion.div
              animate={{
                scale: searchQuery ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-3 sm:left-4 top-3 sm:top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 sm:pl-12 py-5 sm:py-6 bg-card border-border/30 text-foreground placeholder:text-muted-foreground/60 text-base sm:text-lg rounded-lg focus:border-primary focus:shadow-lg focus:shadow-primary/20 transition-all duration-200"
              />
            </motion.div>
          </div>
        </motion.div>

        <ErrorAlert message={error} />

        {isLoading && <MovieGridSkeleton />}

        {!isLoading && movies && movies.length > 0 && (
          <>
            <MoviesGrid
              movies={movies}
              watchlist={watchlist}
              onWatchlistToggle={toggleMovie}
            />

            {currentPage < totalPages && (
              <div
                ref={observerTarget}
                className="mt-8 sm:mt-12 flex flex-col items-center gap-3 py-8"
              >
                {isLoadingMore && (
                  <motion.div
                    className="flex items-center gap-2 text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Loading more movies...</span>
                  </motion.div>
                )}
              </div>
            )}

            {currentPage >= totalPages && (
              <motion.div
                className="mt-8 sm:mt-12 text-center py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-muted-foreground">
                  You&apos;ve reached the end • {movies.length} movies shown
                </p>
              </motion.div>
            )}
          </>
        )}

        {!isLoading && movies?.length === 0 && hasSearched && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-muted-foreground text-lg">
              No movies found matching &quot;{searchQuery}&quot;
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
