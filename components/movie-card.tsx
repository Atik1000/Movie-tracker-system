'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCardProps } from '@/types/components';
import { getImageUrl, getGenreNames } from '@/lib/tmdb';

export function MovieCard({
  movie,
  isInWatchlist = false,
  onWatchlistToggle,
  showRemoveButton = false,
}: MovieCardProps) {
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
    <div className="group bg-card border border-border/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 w-full max-w-sm">
      <div className="relative h-64 overflow-hidden bg-secondary">
        <img
          src={getImageUrl(movie.poster_path, 'w300')}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {movie.vote_average > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-1 text-balance line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{year}</p>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.slice(0, 3).map((genre) => (
              <span
                key={typeof genre === 'string' ? genre : genre.name}
                className="text-xs bg-secondary/60 text-foreground px-2 py-1 rounded-md"
              >
                {typeof genre === 'string' ? genre : genre.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/movie/${movie.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
            >
              {showRemoveButton ? 'View Details' : 'Details'}
            </Button>
          </Link>
          {onWatchlistToggle && (
            <Button
              onClick={handleWatchlistClick}
              className={`px-3 transition-all ${isInWatchlist ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
            >
              <Heart
                className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`}
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
