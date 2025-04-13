'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Set isMounted to true after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First, try to register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Debug: Log the raw response
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        setError('Invalid server response. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.message || 'An error occurred during registration');
        setIsLoading(false);
        return;
      }

      // After successful registration, attempt to sign in
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/dashboard',
      });

      if (signInResult?.error) {
        console.error('Sign in error:', signInResult.error);
        setError('Failed to sign in after registration. Please try logging in.');
        router.push('/?login=true');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Registration/Sign in error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-[32px] font-semibold mb-1 text-[#0F172A]">Sign Up</h2>
        <p className="text-[#64748B] text-base">Create an account to get started</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-base font-medium text-[#0F172A]">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full h-12 px-4 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] text-[#0F172A] placeholder:text-[#94A3B8]"
              required
              disabled={isLoading}
            />
            {isMounted && email && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EF4444] hover:text-[#DC2626]"
                onClick={() => setEmail('')}
                disabled={isLoading}
              >
                <XCircleIcon className="w-5 h-5" />
                <span className="sr-only">Clear email</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-base font-medium text-[#0F172A]">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] text-[#0F172A]"
              required
              disabled={isLoading}
              minLength={6}
            />
            {isMounted && password && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EF4444] hover:text-[#DC2626]"
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
          className="w-full h-12 bg-[#00B86B] text-white rounded-lg text-base font-medium hover:bg-opacity-90 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
} 