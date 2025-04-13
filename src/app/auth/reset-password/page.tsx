'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { apiClient } from '@/lib/api/client';

type FormErrors = {
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])/.test(value)) return 'Password must include at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(value)) return 'Password must include at least one uppercase letter';
        if (!/(?=.*\d)/.test(value)) return 'Password must include at least one number';
        return '';
      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== password) return 'Passwords do not match';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const value = field === 'password' ? password : confirmPassword;
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'password') {
      setPassword(value);
      if (touched.confirmPassword && confirmPassword) {
        // Revalidate confirm password when password changes
        const confirmError = value !== confirmPassword ? 'Passwords do not match' : '';
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
      }
    } else {
      setConfirmPassword(value);
    }

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };

    setErrors(newErrors);
    setTouched({ password: true, confirmPassword: true });

    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrors({ general: 'Invalid or missing reset token' });
      return;
    }

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      // Call the reset password API
      await apiClient.post('/auth/reset-password', {
        token,
        password,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      const message = err.message || 'Failed to reset password. The link may be expired or invalid.';
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect after 3 seconds on successful password reset
  if (isSubmitted) {
    setTimeout(() => {
      router.push('/auth/login');
    }, 3000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        {!token && (
          <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">
            <XCircleIcon className="h-5 w-5 flex-shrink-0" />
            <span>Invalid or expired password reset link. Please request a new one.</span>
          </div>
        )}

        {isSubmitted ? (
          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Password reset successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Your password has been successfully reset. You will be redirected to the login page.
                  </p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <a
                      href="/auth/login"
                      className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Go to login
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00B86B] focus:border-[#00B86B] sm:text-sm`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="text-sm text-gray-500">
                      {showPassword ? 'Hide' : 'Show'}
                    </span>
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#00B86B] focus:border-[#00B86B] sm:text-sm`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {errors.general && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">
                <XCircleIcon className="h-5 w-5 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || !token}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#00B86B] hover:bg-[#00B86B]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B86B] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="text-white" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>

            <div className="text-center">
              <a href="/auth/login" className="text-sm font-medium text-[#00B86B] hover:text-[#00A25F]">
                Back to login
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 