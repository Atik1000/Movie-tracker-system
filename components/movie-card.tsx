'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCardProps } from '@/types/components';
import { getImageUrl, getGenreNames } from '@/lib/tmdb';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function MovieCard({
  movie,
  isInWatchlist = false,
  onWatchlistToggle,
  showRemoveButton = false,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';
  const genres = movie.genre_ids
    ? getGenreNames(movie.genre_ids)
    : movie.genres ?? [];

  const handleWatchlistClick = () => {
    if (onWatchlistToggle) {
      onWatchlistToggle(movie.id, movie.title);
    }
  };

  return (
    <motion.div
      className="group bg-card border border-border/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 w-full max-w-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative h-64 overflow-hidden bg-secondary">
        <motion.img
          src={getImageUrl(movie.poster_path, 'w300')}
          alt={movie.title}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        {movie.vote_average > 0 && (
          <motion.div
            className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            ★ {movie.vote_average.toFixed(1)}
          </motion.div>
        )}
      </div>

      <div className="p-5">
        <motion.h3
          className="font-bold text-lg mb-1 text-balance line-clamp-2"
          animate={{
            color: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
          }}
          transition={{ duration: 0.2 }}
        >
          {movie.title}
        </motion.h3>
        <p className="text-sm text-muted-foreground mb-3">{year}</p>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.slice(0, 3).map((genre, index) => (
              <motion.span
                key={typeof genre === 'string' ? genre : genre.name}
                className="text-xs bg-secondary/60 text-foreground px-2 py-1 rounded-md hover:bg-secondary transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {typeof genre === 'string' ? genre : genre.name}
              </motion.span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/movie/${movie.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/10 bg-transparent relative overflow-hidden group/btn"
            >
              <motion.span
                className="absolute inset-0 bg-primary/5"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">
                {showRemoveButton ? 'View Details' : 'Details'}
              </span>
            </Button>
          </Link>
          {onWatchlistToggle && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleWatchlistClick}
                className={`px-3 transition-all relative overflow-hidden ${isInWatchlist ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
              >
                <motion.div
                  animate={{
                    scale: isInWatchlist ? [1, 1.3, 1] : 1,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`}
                  />
                </motion.div>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
