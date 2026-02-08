'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWatchlist, toggleWatchlist as toggleWatchlistUtil } from '@/lib/watchlist';
import { toast } from 'sonner';

interface UseWatchlistActionsProps {
  userEmail: string | null | undefined;
}

export function useWatchlistActions({ userEmail }: UseWatchlistActionsProps) {
  const [watchlist, setWatchlist] = useState<number[]>([]);

  useEffect(() => {
    if (userEmail) {
      setWatchlist(getWatchlist(userEmail));
    }
  }, [userEmail]);

  const toggleMovie = useCallback(
    (movieId: number, movieTitle: string) => {
      if (!userEmail) return;

      const result = toggleWatchlistUtil(userEmail, movieId);
      setWatchlist(result.watchlist);

      const action = result.isAdded ? 'Added to' : 'Removed from';
      const verb = result.isAdded ? 'added' : 'removed';

      toast.success(`${action} watchlist`, {
        description: `${movieTitle} has been ${verb}.`,
      });
    },
    [userEmail]
  );

  const isInWatchlist = useCallback(
    (movieId: number) => watchlist.includes(movieId),
    [watchlist]
  );

  return {
    watchlist,
    isInWatchlist,
    toggleMovie,
  };
}
