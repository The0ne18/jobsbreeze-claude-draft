'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { ApiError } from '@/types/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage helpers to handle different storage types
const TokenStorage = {
  getToken: (): string | null => {
    // First try from localStorage (remember me)
    const persistentToken = localStorage.getItem('persistent_token');
    if (persistentToken) return persistentToken;
    
    // Fall back to sessionStorage (session only)
    return sessionStorage.getItem('session_token');
  },
  
  setSessionToken: (token: string): void => {
    sessionStorage.setItem('session_token', token);
  },
  
  setPersistentToken: (token: string): void => {
    localStorage.setItem('persistent_token', token);
  },
  
  clearTokens: (): void => {
    localStorage.removeItem('persistent_token');
    sessionStorage.removeItem('session_token');
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session on mount
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = TokenStorage.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Set the token in the API client
      apiClient.setToken(token);

      // Fetch user data
      const response = await apiClient.get<User>('/auth/me');
      setUser(response.data);
    } catch (err) {
      // Clear invalid token
      TokenStorage.clearTokens();
      apiClient.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<{ token: string; user: User }>('/auth/login', {
        email,
        password,
      });

      // Store token based on remember me preference
      const token = response.data.token;
      if (rememberMe) {
        TokenStorage.setPersistentToken(token); // Long-lived in localStorage
      } else {
        TokenStorage.setSessionToken(token); // Session-only in sessionStorage
      }
      
      apiClient.setToken(token);

      // Set user data
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear auth state
      TokenStorage.clearTokens();
      apiClient.setToken(null);
      setUser(null);
      router.push('/auth/login');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      const token = response.data.token;
      
      // Maintain the same storage type as the original token
      if (localStorage.getItem('persistent_token')) {
        TokenStorage.setPersistentToken(token);
      } else {
        TokenStorage.setSessionToken(token);
      }
      
      apiClient.setToken(token);
    } catch (err) {
      // If refresh fails, logout the user
      await logout();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 