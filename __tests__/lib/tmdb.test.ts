process.env.NEXT_PUBLIC_TMDB_API_KEY = 'test-api-key-123';

import {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getImageUrl,
  getGenreNames,
} from '@/lib/tmdb';

describe('TMDB API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getImageUrl', () => {
    it('should return placeholder for null path', () => {
      expect(getImageUrl(null)).toBe('/placeholder.svg');
    });

    it('should return correct URL for valid path', () => {
      const path = '/abc123.jpg';
      const result = getImageUrl(path, 'w500');
      expect(result).toBe('https://image.tmdb.org/t/p/w500/abc123.jpg');
    });

    it('should default to w500 size', () => {
      const path = '/abc123.jpg';
      const result = getImageUrl(path);
      expect(result).toBe('https://image.tmdb.org/t/p/w500/abc123.jpg');
    });
  });

  describe('getGenreNames', () => {
    it('should return genre names for valid IDs', () => {
      const genres = getGenreNames([28, 12, 35]);
      expect(genres).toEqual(['Action', 'Adventure', 'Comedy']);
    });

    it('should return Unknown for invalid IDs', () => {
      const genres = getGenreNames([99999]);
      expect(genres).toEqual(['Unknown']);
    });

    it('should handle empty array', () => {
      const genres = getGenreNames([]);
      expect(genres).toEqual([]);
    });
  });

  describe('searchMovies', () => {
    it('should return empty results for empty query', async () => {
      const result = await searchMovies('');
      expect(result).toEqual({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      });
    });

    it('should fetch movies for valid query', async () => {
      const mockResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Test Movie',
            overview: 'Test overview',
            poster_path: '/test.jpg',
            backdrop_path: '/backdrop.jpg',
            release_date: '2024-01-01',
            vote_average: 8.5,
            genre_ids: [28],
          },
        ],
        total_pages: 1,
        total_results: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchMovies('test');
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('search/movie')
      );
    });

    it('should throw error for failed API call', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(searchMovies('test')).rejects.toThrow();
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details by ID', async () => {
      const mockMovie = {
        id: 1,
        title: 'Test Movie',
        overview: 'Test overview',
        poster_path: '/test.jpg',
        backdrop_path: '/backdrop.jpg',
        release_date: '2024-01-01',
        vote_average: 8.5,
        runtime: 120,
        genres: [{ id: 28, name: 'Action' }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovie,
      });

      const result = await getMovieDetails(1);
      expect(result).toEqual(mockMovie);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('movie/1')
      );
    });
  });

  describe('getPopularMovies', () => {
    it('should fetch popular movies', async () => {
      const mockResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getPopularMovies();
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('movie/popular')
      );
    });
  });
});
