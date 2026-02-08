/**
 * TMDB API module — search, details, popular, images, genres
 */

import type { Movie, SearchResponse } from '@/types/movie';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export function getImageUrl(
  path: string | null,
  size: 'w300' | 'w500' | 'original' = 'w500'
): string {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getGenreNames(genreIds: number[]): string[] {
  return genreIds.map((id) => GENRE_MAP[id] ?? 'Unknown').filter(Boolean);
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<SearchResponse> {
  if (!API_KEY) {
    throw new Error(
      'TMDB API key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in .env.local'
    );
  }

  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }

  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getMovieDetails(
  movieId: string | number
): Promise<Movie> {
  if (!API_KEY) {
    throw new Error(
      'TMDB API key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in .env.local'
    );
  }

  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getPopularMovies(
  page: number = 1
): Promise<SearchResponse> {
  if (!API_KEY) {
    throw new Error(
      'TMDB API key is not configured. Please set NEXT_PUBLIC_TMDB_API_KEY in .env.local'
    );
  }

  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=en-US`
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getMoviesByIds(movieIds: number[]): Promise<Movie[]> {
  if (!API_KEY) {
    throw new Error('TMDB API key is not configured');
  }

  if (movieIds.length === 0) {
    return [];
  }

  const results = await Promise.allSettled(
    movieIds.map((id) => getMovieDetails(id))
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<Movie> => r.status === 'fulfilled'
    )
    .map((r) => r.value);
}
