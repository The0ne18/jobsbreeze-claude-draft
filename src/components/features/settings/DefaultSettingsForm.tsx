'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { defaultSettingsSchema, DefaultSettings } from '@/types/settings';

interface DefaultSettingsFormProps {
  initialData: DefaultSettings;
  onSubmit: (data: DefaultSettings) => void;
  isSubmitting: boolean;
}

export default function DefaultSettingsForm({
  initialData,
  onSubmit,
  isSubmitting,
}: DefaultSettingsFormProps) {
  // Using any to bypass TypeScript's type checking for react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(defaultSettingsSchema) as any,
    defaultValues: {
      defaultTaxRate: initialData.defaultTaxRate || 0,
      estimateExpiry: initialData.estimateExpiry || 30,
      invoiceDue: initialData.invoiceDue || 14,
      defaultTerms: initialData.defaultTerms || '',
      defaultNotes: initialData.defaultNotes || '',
    },
  });

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Default Settings</h2>
        <p className="text-gray-600 text-sm">Set your default values for new estimates and invoices</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="defaultTaxRate" className="block text-sm font-medium text-gray-700">
              Default Tax Rate (%)
            </label>
            <input
              id="defaultTaxRate"
              type="number"
              step="0.1"
              min="0"
              max="100"
              {...register('defaultTaxRate', { valueAsNumber: true })}
              className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
                errors.defaultTaxRate ? 'border-red-500' : 'border-gray-300'
              } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
            {errors.defaultTaxRate && (
              <p className="text-red-500 text-sm mt-1">{errors.defaultTaxRate.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="estimateExpiry" className="block text-sm font-medium text-gray-700">
              Estimate Expiry (days)
            </label>
            <input
              id="estimateExpiry"
              type="number"
              min="1"
              {...register('estimateExpiry', { valueAsNumber: true })}
              className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
                errors.estimateExpiry ? 'border-red-500' : 'border-gray-300'
              } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
            {errors.estimateExpiry && (
              <p className="text-red-500 text-sm mt-1">{errors.estimateExpiry.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="invoiceDue" className="block text-sm font-medium text-gray-700">
              Invoice Due (days)
            </label>
            <input
              id="invoiceDue"
              type="number"
              min="1"
              {...register('invoiceDue', { valueAsNumber: true })}
              className={`w-full h-11 sm:h-12 px-4 rounded-lg border ${
                errors.invoiceDue ? 'border-red-500' : 'border-gray-300'
              } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
            {errors.invoiceDue && <p className="text-red-500 text-sm mt-1">{errors.invoiceDue.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="defaultTerms" className="block text-sm font-medium text-gray-700">
            Default Terms
          </label>
          <textarea
            id="defaultTerms"
            {...register('defaultTerms')}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.defaultTerms ? 'border-red-500' : 'border-gray-300'
            } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            rows={3}
            placeholder="Payment is due within 14 days of invoice date. Please make checks payable to Your Business Name or pay online via the payment link provided on the invoice."
          />
          {errors.defaultTerms && <p className="text-red-500 text-sm mt-1">{errors.defaultTerms.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="defaultNotes" className="block text-sm font-medium text-gray-700">
            Default Notes
          </label>
          <textarea
            id="defaultNotes"
            {...register('defaultNotes')}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.defaultNotes ? 'border-red-500' : 'border-gray-300'
            } text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            rows={3}
            placeholder="Thank you for your business!"
          />
          {errors.defaultNotes && <p className="text-red-500 text-sm mt-1">{errors.defaultNotes.message}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 sm:h-12 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 
              transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving Defaults...' : 'Save Defaults'}
          </button>
        </div>
      </form>
    </div>
  );
} 