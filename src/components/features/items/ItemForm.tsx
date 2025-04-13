'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ItemFormData, itemSchema } from '@/types/item';
import Switch from '@/components/ui/Switch';

interface ItemFormProps {
  initialData?: ItemFormData;
  onSubmit: (data: ItemFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ItemForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ItemFormProps) {
  const defaultValues = {
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'materials',
    price: initialData?.price || 0,
    taxable: initialData?.taxable !== undefined ? initialData.taxable : false,
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(itemSchema.omit({ id: true })),
    defaultValues,
  });

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data as ItemFormData);
      reset();
    } catch (error) {
      console.error('Error submitting item:', error);
    }
  });

  return (
    <form onSubmit={onFormSubmit} className="space-y-8">
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-[#0F172A]">
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="name"
              {...register('name')}
              className="block w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
              placeholder="Item name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name?.message as string}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-[#0F172A]">
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="block w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
              placeholder="Item description (optional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description?.message as string}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-lg font-medium text-[#0F172A]">
              Category
            </label>
            <div className="mt-2">
              <select
                id="category"
                {...register('category')}
                className="block w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
              >
                <option value="materials">Materials</option>
                <option value="labor">Labor</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category?.message as string}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-lg font-medium text-[#0F172A]">
              Rate
            </label>
            <div className="mt-2 relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-[#64748B] sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
                className="block w-full rounded-lg border border-[#E2E8F0] bg-white pl-8 pr-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
                placeholder="0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price?.message as string}</p>
              )}
            </div>
          </div>
        </div>

        {/* Taxable */}
        <div className="mt-4">
          <div className="p-6 bg-[#F8FAFC] rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-[#0F172A]">Taxable</h3>
                <p className="text-[#64748B]">Apply tax to this item when adding to estimates or invoices</p>
              </div>
              <Controller
                name="taxable"
                control={control}
                render={({ field }) => (
                  <Switch
                    defaultChecked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[#00B86B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#00B86B]/90 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 shadow-sm disabled:opacity-50"
        >
          {initialData ? 'Update Item' : 'Create Item'}
        </button>
      </div>
    </form>
  );
} 