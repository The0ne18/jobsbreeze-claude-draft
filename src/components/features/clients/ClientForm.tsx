'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { clientSchema, ClientFormData, Client } from '@/types/client';

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ClientForm({ initialData, onSubmit, onCancel, isLoading = false }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#0F172A]">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B]"
          placeholder="John Smith"
        />
        {errors.name && (
          <p className="mt-2 text-sm text-red-600 font-medium">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#0F172A]">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B]"
          placeholder="john.smith@example.com"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#0F172A]">
          Phone (optional)
        </label>
        <input
          type="tel"
          id="phone"
          {...register('phone')}
          className="mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B]"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#0F172A]">
          Address (optional)
        </label>
        <input
          type="text"
          id="address"
          {...register('address')}
          className="mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B]"
          placeholder="123 Main St, Anytown, CA 90210"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-[#0F172A]">
          Notes
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white text-[#0F172A] shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B]"
          placeholder="Add any additional notes about this client..."
        />
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg border border-transparent bg-[#00B86B] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#00B86B]/90 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Save Client'}
        </button>
      </div>
    </form>
  );
} 