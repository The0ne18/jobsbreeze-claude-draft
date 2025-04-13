import { useCallback, useEffect } from 'react';
import { useApiStore } from '@/stores/api';
import { ApiError } from '@/lib/api/client';

interface QueryOptions<T> {
  key: string;
  queryFn: () => Promise<T>;
  enabled?: boolean;
  cacheTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export function useQuery<T>({
  key,
  queryFn,
  enabled = true,
  cacheTime,
  onSuccess,
  onError,
}: QueryOptions<T>) {
  const {
    getCache,
    setCache,
    setLoading,
    isLoading,
    setError,
    getError,
    clearError,
  } = useApiStore();

  const fetchData = useCallback(async () => {
    setLoading(key, true);
    clearError(key);

    try {
      const data = await queryFn();
      setCache(key, data, cacheTime);
      onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err as ApiError;
      setError(key, error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(key, false);
    }
  }, [key, queryFn, cacheTime, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) return;

    const cachedData = getCache<T>(key);
    if (cachedData) {
      onSuccess?.(cachedData);
      return;
    }

    fetchData().catch(() => {}); // Error is already handled in fetchData
  }, [key, enabled, fetchData]);

  return {
    data: getCache<T>(key),
    isLoading: isLoading(key),
    error: getError(key),
    refetch: fetchData,
  };
} 