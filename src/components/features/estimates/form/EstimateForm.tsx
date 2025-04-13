'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { EstimateFormData, estimateSchema } from '@/types/estimate';
import ClientSelect from './ClientSelect';
import LineItems from './LineItems';

interface EstimateFormProps {
  initialData?: Partial<EstimateFormData>;
  onSubmit: (data: EstimateFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EstimateForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: EstimateFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<EstimateFormData>({
    resolver: zodResolver(estimateSchema),
    defaultValues: initialData,
  });

  // Watch line items and tax rate for calculations
  const lineItems = useWatch({ control, name: 'lineItems' });
  const taxRate = useWatch({ control, name: 'taxRate' });

  // Calculate totals whenever line items or tax rate changes
  useEffect(() => {
    if (lineItems) {
      const subtotal = lineItems.reduce((sum, item) => {
        const quantity = parseFloat(String(item.quantity)) || 0;
        const unitPrice = parseFloat(String(item.unitPrice)) || 0;
        return sum + quantity * unitPrice;
      }, 0);

      const tax = subtotal * (parseFloat(String(taxRate)) || 0) / 100;
      const total = subtotal + tax;

      setValue('subtotal', subtotal);
      setValue('tax', tax);
      setValue('amount', total);
    }
  }, [lineItems, taxRate, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <ClientSelect
            control={control}
            error={errors.clientId}
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[#0F172A]">
            Date
          </label>
          <input
            type="date"
            id="date"
            {...register('date')}
            className={`mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
              errors.date ? 'border-red-500' : ''
            }`}
          />
          {errors.date && (
            <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-[#0F172A]">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            {...register('expiryDate')}
            className={`mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
              errors.expiryDate ? 'border-red-500' : ''
            }`}
          />
          {errors.expiryDate && (
            <p className="mt-2 text-sm text-red-600">{errors.expiryDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="taxRate" className="block text-sm font-medium text-[#0F172A]">
            Tax Rate (%)
          </label>
          <input
            type="number"
            id="taxRate"
            step="0.01"
            {...register('taxRate', { valueAsNumber: true })}
            className={`mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
              errors.taxRate ? 'border-red-500' : ''
            }`}
            min="0"
          />
          {errors.taxRate && (
            <p className="mt-2 text-sm text-red-600">{errors.taxRate.message}</p>
          )}
        </div>
      </div>

      <LineItems
        control={control}
        register={register}
        errors={errors}
      />

      <div className="space-y-4">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-[#0F172A]">
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            {...register('notes')}
            className={`mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
              errors.notes ? 'border-red-500' : ''
            }`}
            placeholder="Add any notes or special instructions..."
          />
          {errors.notes && (
            <p className="mt-2 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="terms" className="block text-sm font-medium text-[#0F172A]">
            Terms and Conditions
          </label>
          <textarea
            id="terms"
            rows={3}
            {...register('terms')}
            className={`mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
              errors.terms ? 'border-red-500' : ''
            }`}
            placeholder="Enter your terms and conditions..."
          />
          {errors.terms && (
            <p className="mt-2 text-sm text-red-600">{errors.terms.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-[#0F172A]">Subtotal:</span>
            <span className="text-[#64748B]">${useWatch({ control, name: 'subtotal' })?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium text-[#0F172A]">Tax ({taxRate}%):</span>
            <span className="text-[#64748B]">${useWatch({ control, name: 'tax' })?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span className="text-[#0F172A]">Total:</span>
            <span className="text-[#00B86B]">${useWatch({ control, name: 'amount' })?.toFixed(2) || '0.00'}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg border border-transparent bg-[#00B86B] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#00A65F] focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Estimate'}
          </button>
        </div>
      </div>
    </form>
  );
} 