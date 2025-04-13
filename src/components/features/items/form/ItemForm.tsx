import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ItemFormData, itemSchema } from '@/types/item';
import Dialog from '@/components/ui/Dialog';
import Switch from '@/components/ui/Switch';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => Promise<void>;
  initialData?: ItemFormData;
}

export function ItemForm({ isOpen, onClose, onSubmit, initialData }: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: initialData || {
      name: '',
      category: 'materials',
      price: 0,
    },
  });

  const onFormSubmit = async (data: ItemFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to submit item:', error);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Item' : 'New Item'}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#0F172A]">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-2 block w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
            placeholder="Item name"
          />
          {errors.name && (
            <p className="mt-2 text-sm font-medium text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[#0F172A]">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="mt-2 block w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm resize-none"
            placeholder="Item description (optional)"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-[#0F172A]">
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className="mt-2 block w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
            >
              <option value="materials">Materials</option>
              <option value="labor">Labor</option>
              <option value="equipment">Equipment</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-2 text-sm font-medium text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-[#0F172A]">
              Rate
            </label>
            <div className="mt-2 relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#64748B]">
                $
              </span>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
                className="block w-full rounded-lg border border-[#E2E8F0] bg-white pl-8 pr-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
                placeholder="0"
              />
            </div>
            {errors.price && (
              <p className="mt-2 text-sm font-medium text-red-600">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-[#E2E8F0] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-[#0F172A]">Taxable</h3>
              <p className="text-sm text-[#64748B]">
                Apply tax to this item when adding to estimates or invoices
              </p>
            </div>
            <Switch />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-sm font-medium text-[#0F172A] hover:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-[#00B86B] px-6 py-3 text-sm font-medium text-white hover:bg-[#00B86B]/90 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 shadow-sm transition-colors disabled:opacity-50"
          >
            {initialData ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>
    </Dialog>
  );
} 