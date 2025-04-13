import { useCallback } from 'react';
import { useApiStore } from '@/stores/api';
import { ApiError } from '@/lib/api/client';

interface MutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: ApiError, variables: TVariables) => void | Promise<void>;
  invalidateQueries?: string[];
}

export function useMutation<TData, TVariables = void>({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries = [],
}: MutationOptions<TData, TVariables>) {
  const { setLoading, isLoading, setError, getError, clearError, clearCache } =
    useApiStore();

  const mutationKey = mutationFn.toString();

  const mutate = useCallback(
    async (variables: TVariables) => {
      setLoading(mutationKey, true);
      clearError(mutationKey);

      try {
        const data = await mutationFn(variables);
        
        // Invalidate affected queries
        invalidateQueries.forEach(queryKey => {
          clearCache(queryKey);
        });

        await onSuccess?.(data, variables);
        return data;
      } catch (err) {
        const error = err as ApiError;
        setError(mutationKey, error);
        await onError?.(error, variables);
        throw error;
      } finally {
        setLoading(mutationKey, false);
      }
    },
    [mutationFn, onSuccess, onError, invalidateQueries]
  );

  return {
    mutate,
    isLoading: isLoading(mutationKey),
    error: getError(mutationKey),
  };
} 