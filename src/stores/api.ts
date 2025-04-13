import { create } from 'zustand';
import { ApiError } from '@/lib/api/client';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

interface ApiState {
  cache: Record<string, CacheItem<any>>;
  loading: Record<string, boolean>;
  errors: Record<string, ApiError | null>;
  
  // Cache management
  setCache: <T>(key: string, data: T, expiresIn?: number) => void;
  getCache: <T>(key: string) => T | null;
  clearCache: (key?: string) => void;
  
  // Loading state
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key: string) => boolean;
  
  // Error handling
  setError: (key: string, error: ApiError | null) => void;
  getError: (key: string) => ApiError | null;
  clearError: (key?: string) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default cache duration

export const useApiStore = create<ApiState>((set, get) => ({
  cache: {},
  loading: {},
  errors: {},

  setCache: (key, data, expiresIn = CACHE_DURATION) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [key]: {
          data,
          timestamp: Date.now(),
          expiresIn,
        },
      },
    }));
  },

  getCache: (key) => {
    const item = get().cache[key];
    if (!item) return null;

    const isExpired = Date.now() > item.timestamp + item.expiresIn;
    if (isExpired) {
      get().clearCache(key);
      return null;
    }

    return item.data;
  },

  clearCache: (key) => {
    set((state) => ({
      cache: key
        ? Object.fromEntries(
            Object.entries(state.cache).filter(([k]) => k !== key)
          )
        : {},
    }));
  },

  setLoading: (key, isLoading) => {
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: isLoading,
      },
    }));
  },

  isLoading: (key) => {
    return get().loading[key] || false;
  },

  setError: (key, error) => {
    set((state) => ({
      errors: {
        ...state.errors,
        [key]: error,
      },
    }));
  },

  getError: (key) => {
    return get().errors[key] || null;
  },

  clearError: (key) => {
    set((state) => ({
      errors: key
        ? Object.fromEntries(
            Object.entries(state.errors).filter(([k]) => k !== key)
          )
        : {},
    }));
  },
})); 