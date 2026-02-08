'use client';

import { useEffect } from 'react';
import { Heart, ArrowLeft, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Movie } from '@/types/movie';
import { getMovieDetails, getImageUrl } from '@/lib/tmdb';
import { useWatchlistActions } from '@/hooks/use-watchlist-actions';
import { useMovieLoader } from '@/hooks/use-movie-loader';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const movieId = params?.id as string;
  const { data: movie, isLoading, error, loadData } = useMovieLoader<Movie>();
  const { isInWatchlist, toggleMovie } = useWatchlistActions({
    userEmail: user?.email,
  });

  useEffect(() => {
    if (movieId) {
      loadData(() => getMovieDetails(movieId));
    }
  }, [movieId, loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-destructive mb-4">{error ?? 'Movie not found'}</p>
        <Link href="/search">
          <Button>Back to Search</Button>
        </Link>
      </div>
    );
  }

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
  const genres = movie.genres ?? [];

  return (
    <div className="min-h-screen bg-background">
      <motion.nav
        className="bg-card/80 backdrop-blur-md border-b border-border/30 p-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mb-4"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </motion.button>
        </div>
      </motion.nav>

      <motion.div
        className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          src={getImageUrl(
            movie.backdrop_path ?? movie.poster_path,
            'original'
          )}
          alt={movie.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 md:-mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            className="md:col-span-1 flex justify-center md:block"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="rounded-lg overflow-hidden shadow-2xl mb-6 w-full max-w-xs md:max-w-none"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 text-balance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {movie.title}
            </motion.h1>
            {movie.tagline && (
              <p className="text-lg text-muted-foreground italic mb-4">
                &quot;{movie.tagline}&quot;
              </p>
            )}
            <p className="text-muted-foreground mb-6 flex items-center gap-4">
              <span>{year}</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                {movie.vote_average.toFixed(1)}
              </span>
              <span>{runtime}</span>
            </p>

            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {user && (
              <motion.div
                className="flex gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => toggleMovie(movie.id, movie.title)}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${isInWatchlist(movie.id) ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary/50 text-foreground hover:bg-secondary'}`}
                  >
                    <motion.div
                      animate={isInWatchlist(movie.id) ? {
                        scale: [1, 1.3, 1],
                      } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={`w-5 h-5 ${isInWatchlist(movie.id) ? 'fill-current' : ''}`}
                      />
                    </motion.div>
                    {isInWatchlist(movie.id)
                      ? 'Remove from Watchlist'
                      : 'Add to Watchlist'}
                  </Button>
                </motion.div>
              </motion.div>
            )}

            <motion.div className="space-y-6">
              {movie.release_date && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Release Date
                  </h3>
                  <p className="text-lg">
                    {new Date(movie.release_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}

              {movie.overview && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Overview
                  </h3>
                  <p className="text-lg leading-relaxed text-foreground/90">
                    {movie.overview}
                  </p>
                </div>
              )}

              {movie.status && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Status
                  </h3>
                  <p className="text-lg">{movie.status}</p>
                </div>
              )}
            </motion.div>

            <motion.div
              className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link href="/search" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
                >
                  Continue Searching
                </Button>
              </Link>
              <Link href="/watchlist" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  View Watchlist
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
