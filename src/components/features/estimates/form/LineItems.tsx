'use client';

import { Control, UseFormRegister, useFieldArray, FieldErrors } from 'react-hook-form';
import { EstimateFormData } from '@/types/estimate';
import { TrashIcon } from '@heroicons/react/24/outline';

interface LineItemsProps {
  control: Control<EstimateFormData>;
  register: UseFormRegister<EstimateFormData>;
  errors: FieldErrors<EstimateFormData>;
}

export default function LineItems({ control, register, errors }: LineItemsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems',
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[#0F172A]">Line Items</h3>
        <button
          type="button"
          onClick={() => append({ description: '', quantity: 1, unitPrice: 0, amount: 0, category: 'labor' })}
          className="rounded-lg bg-[#00B86B] px-4 py-2 text-sm font-medium text-white hover:bg-[#00A65F] focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2"
        >
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E2E8F0]">
          <thead>
            <tr className="text-left text-sm font-medium text-[#64748B]">
              <th className="py-3.5 pl-4 pr-3">Description</th>
              <th className="px-3 py-3.5">Category</th>
              <th className="px-3 py-3.5">Quantity</th>
              <th className="px-3 py-3.5">Unit Price</th>
              <th className="px-3 py-3.5">Amount</th>
              <th className="py-3.5 pl-3 pr-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {fields.map((field, index) => {
              const quantity = parseFloat(String(field.quantity)) || 0;
              const unitPrice = parseFloat(String(field.unitPrice)) || 0;
              const amount = quantity * unitPrice;

              return (
                <tr key={field.id}>
                  <td className="py-4 pl-4 pr-3">
                    <input
                      type="text"
                      {...register(`lineItems.${index}.description`)}
                      className={`block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
                        errors.lineItems?.[index]?.description ? 'border-red-500' : ''
                      }`}
                      placeholder="Item description"
                    />
                    {errors.lineItems?.[index]?.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lineItems[index].description.message}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <select
                      {...register(`lineItems.${index}.category`)}
                      className={`block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
                        errors.lineItems?.[index]?.category ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="labor">Labor</option>
                      <option value="material">Material</option>
                      <option value="equipment">Equipment</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.lineItems?.[index]?.category && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lineItems[index].category.message}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <input
                      type="number"
                      {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                      className={`block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
                        errors.lineItems?.[index]?.quantity ? 'border-red-500' : ''
                      }`}
                      min="0"
                      step="1"
                    />
                    {errors.lineItems?.[index]?.quantity && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lineItems[index].quantity.message}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <input
                      type="number"
                      {...register(`lineItems.${index}.unitPrice`, { valueAsNumber: true })}
                      className={`block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
                        errors.lineItems?.[index]?.unitPrice ? 'border-red-500' : ''
                      }`}
                      min="0"
                      step="0.01"
                    />
                    {errors.lineItems?.[index]?.unitPrice && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lineItems[index].unitPrice.message}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <span className="text-[#0F172A] font-medium">
                      ${amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 pl-3 pr-4">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus:outline-none"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="sr-only">Remove item</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 