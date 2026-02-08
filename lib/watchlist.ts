/**
 * Watchlist utilities — per-user movie watchlists in localStorage
 */

const WATCHLIST_PREFIX = 'movieTrack.watchlist.';

export function getWatchlist(userEmail: string): number[] {
  if (typeof window === 'undefined') return [];

  try {
    const key = `${WATCHLIST_PREFIX}${userEmail.toLowerCase()}`;
    const stored = window.localStorage.getItem(key);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id): id is number => typeof id === 'number');
  } catch (error) {
    console.error('Error reading watchlist:', error);
    return [];
  }
}

export function setWatchlist(userEmail: string, movieIds: number[]): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${WATCHLIST_PREFIX}${userEmail.toLowerCase()}`;
    const uniqueIds = Array.from(new Set(movieIds));
    window.localStorage.setItem(key, JSON.stringify(uniqueIds));
  } catch (error) {
    console.error('Error saving watchlist:', error);
  }
}

export function addToWatchlist(userEmail: string, movieId: number): number[] {
  const current = getWatchlist(userEmail);
  if (current.includes(movieId)) return current;

  const updated = [...current, movieId];
  setWatchlist(userEmail, updated);
  return updated;
}

export function removeFromWatchlist(
  userEmail: string,
  movieId: number
): number[] {
  const current = getWatchlist(userEmail);
  const updated = current.filter((id) => id !== movieId);
  setWatchlist(userEmail, updated);
  return updated;
}

export function isInWatchlist(userEmail: string, movieId: number): boolean {
  return getWatchlist(userEmail).includes(movieId);
}

export function toggleWatchlist(
  userEmail: string,
  movieId: number
): { watchlist: number[]; isAdded: boolean } {
  const current = getWatchlist(userEmail);
  const isCurrentlyInList = current.includes(movieId);

  const updated = isCurrentlyInList
    ? removeFromWatchlist(userEmail, movieId)
    : addToWatchlist(userEmail, movieId);

  return {
    watchlist: updated,
    isAdded: !isCurrentlyInList,
  };
}

export function clearWatchlist(userEmail: string): void {
  if (typeof window === 'undefined') return;

  try {
    const key = `${WATCHLIST_PREFIX}${userEmail.toLowerCase()}`;
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing watchlist:', error);
  }
}
