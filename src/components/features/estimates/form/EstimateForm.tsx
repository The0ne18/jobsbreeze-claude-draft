'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Client, EstimateFormData, LineItem } from '@/types/estimates';
import ClientSelect from './ClientSelect';
import LineItems from './LineItems';

interface EstimateFormProps {
  initialData?: EstimateFormData;
  isEdit?: boolean;
  estimateId?: number;
  onSuccess?: () => void;
}

export default function EstimateForm({ initialData, isEdit, estimateId, onSuccess }: EstimateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<EstimateFormData>(() => ({
    clientId: initialData?.clientId || 0,
    date: initialData?.date || new Date(),
    expiryDate: initialData?.expiryDate,
    notes: initialData?.notes || '',
    terms: initialData?.terms || '',
    taxRate: initialData?.taxRate || 0,
    lineItems: initialData?.lineItems || [],
  }));

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * (formData.taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) {
      newErrors.client = 'Please select a client';
    }

    if (formData.lineItems.length === 0) {
      newErrors.lineItems = 'Please add at least one line item';
    }

    formData.lineItems.forEach((item, index) => {
      if (!item.description) {
        newErrors[`item-${index}-description`] = 'Description is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item-${index}-quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice < 0) {
        newErrors[`item-${index}-unitPrice`] = 'Unit price cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const endpoint = isEdit
        ? `/api/estimates/${estimateId}`
        : '/api/estimates';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isDraft,
          date: format(formData.date, 'yyyy-MM-dd'),
          expiryDate: formData.expiryDate
            ? format(formData.expiryDate, 'yyyy-MM-dd')
            : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save estimate');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving estimate:', error);
      setErrors({
        submit: 'Failed to save estimate. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
          <div className="mt-4">
            <ClientSelect
              selectedClient={selectedClient}
              onSelect={(client) => {
                setSelectedClient(client);
                setFormData((prev) => ({ ...prev, clientId: client.id }));
              }}
              error={errors.client}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Estimate Details</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Estimate Date
              </label>
              <input
                type="date"
                id="date"
                value={format(formData.date, 'yyyy-MM-dd')}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    date: new Date(e.target.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                value={formData.expiryDate ? format(formData.expiryDate, 'yyyy-MM-dd') : ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expiryDate: e.target.value ? new Date(e.target.value) : undefined,
                  }))
                }
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <LineItems
          items={formData.lineItems}
          onChange={(items) => setFormData((prev) => ({ ...prev, lineItems: items }))}
          error={errors.lineItems}
        />

        <div>
          <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="terms" className="block text-sm font-medium text-gray-700">
                Terms and Conditions
              </label>
              <textarea
                id="terms"
                rows={3}
                value={formData.terms}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, terms: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Summary</h3>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-sm font-medium text-gray-900">
                ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="taxRate" className="text-sm text-gray-500">
                  Tax Rate (%)
                </label>
                <div className="w-24">
                  <input
                    type="number"
                    id="taxRate"
                    min="0"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        taxRate: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="block w-full rounded-md border-0 py-1.5 text-right text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="mt-1 flex justify-between">
                <span className="text-sm text-gray-500">Tax Amount</span>
                <span className="text-sm font-medium text-gray-900">
                  ${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4">
              <span className="text-base font-medium text-gray-900">Total</span>
              <span className="text-base font-medium text-gray-900">
                ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{errors.submit}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-x-3">
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Estimate' : 'Create Estimate'}
        </button>
      </div>
    </form>
  );
} 