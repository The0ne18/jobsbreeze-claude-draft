import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ClientSelect } from '@/components/features/estimates/form/ClientSelect';
import { LineItems } from './LineItems';

interface Invoice {
  id?: string;
  number: string;
  clientId: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  total: number;
  dueDate: Date;
  lineItems: Array<{
    id?: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

interface InvoiceFormProps {
  invoice?: Invoice;
  onSuccess: () => void;
}

export function InvoiceForm({ invoice, onSuccess }: InvoiceFormProps) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Invoice>(
    invoice || {
      number: '',
      clientId: '',
      status: 'draft',
      total: 0,
      dueDate: new Date(),
      lineItems: [],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Add API call here to save invoice
      onSuccess();
    } catch (err) {
      setError('Failed to save invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLineItems = (lineItems: Invoice['lineItems']) => {
    const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
    setFormData({ ...formData, lineItems, total });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-[#0F172A]">
            Invoice Number
          </label>
          <Input
            id="number"
            type="text"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            className="mt-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A]">
            Client
          </label>
          <div className="mt-2">
            <ClientSelect
              value={formData.clientId}
              onChange={(clientId) => setFormData({ ...formData, clientId })}
            />
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-[#0F172A]">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate.toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
            className="mt-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A]">
            Line Items
          </label>
          <div className="mt-2">
            <LineItems
              items={formData.lineItems}
              onChange={updateLineItems}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A]">
            Total
          </label>
          <div className="mt-2 text-lg font-medium text-[#0F172A]">
            ${formData.total.toFixed(2)}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm font-medium mt-2">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00B86B] text-white px-6 py-2 rounded-lg hover:bg-[#00A05D] focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
} 