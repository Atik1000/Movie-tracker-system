import {
  getWatchlist,
  setWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  toggleWatchlist,
  clearWatchlist,
} from '@/lib/watchlist';

describe('Watchlist Utilities', () => {
  const testEmail = 'test@example.com';
  const movieId = 123;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getWatchlist', () => {
    it('should return empty array for new user', () => {
      const watchlist = getWatchlist(testEmail);
      expect(watchlist).toEqual([]);
    });

    it('should return stored watchlist', () => {
      const mockWatchlist = [1, 2, 3];
      localStorage.setItem(
        `movieTrack.watchlist.${testEmail.toLowerCase()}`,
        JSON.stringify(mockWatchlist)
      );

      const watchlist = getWatchlist(testEmail);
      expect(watchlist).toEqual(mockWatchlist);
    });

    it('should handle corrupted data', () => {
      localStorage.setItem(
        `movieTrack.watchlist.${testEmail.toLowerCase()}`,
        'invalid json'
      );

      const watchlist = getWatchlist(testEmail);
      expect(watchlist).toEqual([]);
    });
  });

  describe('setWatchlist', () => {
    it('should store watchlist in localStorage', () => {
      const movieIds = [1, 2, 3];
      setWatchlist(testEmail, movieIds);

      const stored = localStorage.getItem(
        `movieTrack.watchlist.${testEmail.toLowerCase()}`
      );
      expect(JSON.parse(stored!)).toEqual(movieIds);
    });

    it('should remove duplicates', () => {
      const movieIds = [1, 2, 2, 3, 3];
      setWatchlist(testEmail, movieIds);

      const stored = localStorage.getItem(
        `movieTrack.watchlist.${testEmail.toLowerCase()}`
      );
      expect(JSON.parse(stored!)).toEqual([1, 2, 3]);
    });
  });

  describe('addToWatchlist', () => {
    it('should add movie to empty watchlist', () => {
      const result = addToWatchlist(testEmail, movieId);
      expect(result).toEqual([movieId]);
    });

    it('should add movie to existing watchlist', () => {
      setWatchlist(testEmail, [1, 2]);
      const result = addToWatchlist(testEmail, 3);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should not add duplicate movie', () => {
      setWatchlist(testEmail, [1, 2, 3]);
      const result = addToWatchlist(testEmail, 2);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove movie from watchlist', () => {
      setWatchlist(testEmail, [1, 2, 3]);
      const result = removeFromWatchlist(testEmail, 2);
      expect(result).toEqual([1, 3]);
    });

    it('should handle removing non-existent movie', () => {
      setWatchlist(testEmail, [1, 2, 3]);
      const result = removeFromWatchlist(testEmail, 999);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('isInWatchlist', () => {
    it('should return true for movie in watchlist', () => {
      setWatchlist(testEmail, [1, 2, 3]);
      expect(isInWatchlist(testEmail, 2)).toBe(true);
    });

    it('should return false for movie not in watchlist', () => {
      setWatchlist(testEmail, [1, 2, 3]);
      expect(isInWatchlist(testEmail, 999)).toBe(false);
    });
  });

  describe('toggleWatchlist', () => {
    it('should add movie if not in watchlist', () => {
      const result = toggleWatchlist(testEmail, movieId);
      expect(result.isAdded).toBe(true);
      expect(result.watchlist).toEqual([movieId]);
    });

    it('should remove movie if in watchlist', () => {
      setWatchlist(testEmail, [movieId]);
      const result = toggleWatchlist(testEmail, movieId);
      expect(result.isAdded).toBe(false);
      expect(result.watchlist).toEqual([]);
    });
  });

  describe('clearWatchlist', () => {
    it('should clear user watchlist', () => {
      setWatchlist(testEmail, [1, 2, 3]);
      clearWatchlist(testEmail);

      const watchlist = getWatchlist(testEmail);
      expect(watchlist).toEqual([]);
    });
  });
});
