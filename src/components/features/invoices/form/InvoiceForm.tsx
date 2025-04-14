'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LineItems } from './LineItems';
import { Invoice, LineItem, InvoiceStatus, invoiceSchema } from '@/types/invoice';
import { SimpleClient } from '@/types/client';
import { useInvoices } from '@/hooks/useInvoices';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSuccess: () => void;
}

type InvoiceFormData = Omit<Invoice, 'id' | 'client' | 'createdAt'>;

export function InvoiceForm({ invoice, onSuccess }: InvoiceFormProps) {
  const { addInvoice, updateInvoice, isLoading } = useInvoices();
  const [clients, setClients] = useState<SimpleClient[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoice ? {
      number: invoice.number,
      clientId: invoice.clientId,
      status: invoice.status,
      total: invoice.total,
      dueDate: new Date(invoice.dueDate),
      lineItems: invoice.lineItems,
    } : {
      number: '',
      clientId: '',
      status: 'draft',
      total: 0,
      dueDate: new Date(),
      lineItems: [],
    },
  });

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Watch line items for total calculation
  const lineItems = watch('lineItems');

  // Calculate total whenever line items change
  useEffect(() => {
    if (lineItems) {
      const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
      setValue('total', total);
    }
  }, [lineItems, setValue]);

  const handleLineItemsChange = (items: LineItem[]) => {
    setValue('lineItems', items);
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      if (invoice?.id) {
        await updateInvoice(invoice.id, data as Invoice);
      } else {
        await addInvoice(data as Invoice);
      }
      onSuccess();
    } catch (err) {
      console.error('Failed to save invoice:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-[#0F172A]">
            Invoice Number
          </label>
          <Input
            id="number"
            type="text"
            {...register('number')}
            className={`mt-2 ${errors.number ? 'border-red-500' : ''}`}
          />
          {errors.number && (
            <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A]">
            Client
          </label>
          <div className="mt-2">
            <select
              {...register('clientId', { valueAsNumber: true })}
              className={`mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
                errors.clientId ? 'border-red-300' : ''
              }`}
              disabled={isLoadingClients}
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="mt-2 text-sm font-medium text-red-600">{errors.clientId.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-[#0F172A]">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className={`mt-2 ${errors.dueDate ? 'border-red-500' : ''}`}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A]">
            Line Items
          </label>
          <div className="mt-2">
            <LineItems
              items={lineItems || []}
              onChange={handleLineItemsChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0F172A]">
            Total
          </label>
          <div className="mt-2 text-lg font-medium text-[#0F172A]">
            ${watch('total')?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#00B86B] text-white px-6 py-2 rounded-lg hover:bg-[#00A05D] focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
} 
