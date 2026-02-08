'use client';

import { useState, useCallback } from 'react';

interface UseMovieLoaderReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string;
  loadData: (loader: () => Promise<T>) => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function useMovieLoader<T>(): UseMovieLoaderReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async (loader: () => Promise<T>) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await loader();
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    loadData,
    setData,
  };
}
