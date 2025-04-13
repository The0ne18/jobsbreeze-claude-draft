'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Set isMounted to true after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 sm:p-8 max-w-[400px] mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-[32px] font-semibold mb-2 text-[#0F172A] tracking-tight">
          Welcome back
        </h2>
        <p className="text-[#64748B] text-base">
          Enter your credentials to access your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-[#0F172A]"
          >
            Email address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 sm:h-12 px-4 rounded-lg border border-[#E2E8F0] text-base
                focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:border-transparent
                text-[#0F172A] placeholder:text-[#94A3B8] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isLoading}
            />
            {isMounted && email && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] 
                  hover:text-[#64748B] transition-colors p-1 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
                onClick={() => setEmail('')}
                disabled={isLoading}
              >
                <XCircleIcon className="w-5 h-5" />
                <span className="sr-only">Clear email</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-[#0F172A]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 sm:h-12 px-4 rounded-lg border border-[#E2E8F0] text-base
                focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:border-transparent
                text-[#0F172A] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              required
              disabled={isLoading}
            />
            {isMounted && password && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] 
                  hover:text-[#64748B] transition-colors p-1 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-[#00B86B]"
                onClick={() => setPassword('')}
                disabled={isLoading}
              >
                <XCircleIcon className="w-5 h-5" />
                <span className="sr-only">Clear password</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-[#EF4444] text-sm bg-red-50 px-3 py-2 rounded-md">
            <XCircleIcon className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 bg-[#00B86B] text-white rounded-lg text-base font-medium
            hover:bg-[#00A25F] transition-colors focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-[#00B86B] disabled:opacity-50 
            disabled:cursor-not-allowed disabled:hover:bg-[#00B86B]"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
} 