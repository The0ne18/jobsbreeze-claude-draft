'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessInfoSchema, BusinessInfo } from '@/types/settings';

interface BusinessInfoFormProps {
  initialData: BusinessInfo;
  onSubmit: (data: BusinessInfo) => void;
  isSubmitting: boolean;
}

export default function BusinessInfoForm({ initialData, onSubmit, isSubmitting }: BusinessInfoFormProps) {
  // Using any to bypass TypeScript's type checking for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessInfoSchema) as any,
    defaultValues: initialData,
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Business Information</h2>
        <p className="text-gray-600 text-sm">This information will appear on your estimates and invoices</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            id="businessName"
            type="text"
            {...register('businessName')}
            className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
              errors.businessName ? 'border-red-500' : 'border-gray-300'
            } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            placeholder="Your Business Name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              {...register('phone')}
              className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            {...register('address')}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            rows={3}
            placeholder="123 Business St, Suite 101, City, State, 12345"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            id="website"
            type="text"
            {...register('website')}
            className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            placeholder="www.yourbusiness.com"
          />
          {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
              Default Tax Rate (%)
            </label>
            <input
              id="taxRate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register('taxRate', { valueAsNumber: true })}
              className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
                errors.taxRate ? 'border-red-500' : 'border-gray-300'
              } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="0.00"
            />
            {errors.taxRate && <p className="text-red-500 text-sm mt-1">{errors.taxRate.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="invoiceDueDays" className="block text-sm font-medium text-gray-700">
              Default Payment Terms (Days)
            </label>
            <input
              id="invoiceDueDays"
              type="number"
              min="0"
              {...register('invoiceDueDays', { valueAsNumber: true })}
              className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
                errors.invoiceDueDays ? 'border-red-500' : 'border-gray-300'
              } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="14"
            />
            {errors.invoiceDueDays && <p className="text-red-500 text-sm mt-1">{errors.invoiceDueDays.message}</p>}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 sm:h-12 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 
              transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 