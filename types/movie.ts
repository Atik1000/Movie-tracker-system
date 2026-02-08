/**
 * Movie type definitions
 */

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  homepage?: string;
  status?: string;
  budget?: number;
  revenue?: number;
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
