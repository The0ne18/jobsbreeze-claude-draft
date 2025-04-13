'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ClientSelect from '@/components/features/estimates/form/ClientSelect';
import { LineItems } from './LineItems';
import { Invoice, LineItem, InvoiceStatus } from '@/types/invoice';
import { Client } from '@/types/estimates';
import { useInvoices } from '@/hooks/useInvoices';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSuccess: () => void;
}

export function InvoiceForm({ invoice, onSuccess }: InvoiceFormProps) {
  const { addInvoice, updateInvoice, isLoading } = useInvoices();
  const [error, setError] = useState('');
  
  // Initialize the selected client with only the properties that ClientSelect expects
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    invoice?.client && invoice.client.name && invoice.client.email
      ? {
          id: Number(invoice.clientId) || 0,
          name: invoice.client.name,
          email: invoice.client.email,
          // Add empty values for the other required Client properties
          phone: '',
          address: ''
        }
      : null
  );
  
  const [formData, setFormData] = useState<{
    number: string;
    clientId: string;
    status: InvoiceStatus;
    total: number;
    dueDate: Date;
    lineItems: LineItem[];
  }>(
    invoice
      ? {
          number: invoice.number,
          clientId: invoice.clientId,
          status: invoice.status,
          total: invoice.total,
          dueDate: invoice.dueDate,
          lineItems: invoice.lineItems,
        }
      : {
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

    if (!selectedClient) {
      setError('Please select a client');
      return;
    }

    try {
      if (invoice?.id) {
        await updateInvoice(invoice.id, {
          ...formData,
          client: {
            name: selectedClient.name,
            email: selectedClient.email
          }
        });
      } else {
        await addInvoice({
          ...formData,
          client: {
            name: selectedClient.name,
            email: selectedClient.email
          },
          createdAt: new Date(),
        } as Omit<Invoice, 'id'>);
      }
      onSuccess();
    } catch (err) {
      setError('Failed to save invoice. Please try again.');
    }
  };

  const updateLineItems = (lineItems: LineItem[]) => {
    const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
    setFormData({ ...formData, lineItems, total });
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setFormData({ ...formData, clientId: client.id.toString() });
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
              selectedClient={selectedClient}
              onSelect={handleClientSelect}
              error={error && !selectedClient ? 'Please select a client' : undefined}
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
            value={formData.dueDate instanceof Date ? formData.dueDate.toISOString().split('T')[0] : ''}
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
          disabled={isLoading}
          className="bg-[#00B86B] text-white px-6 py-2 rounded-lg hover:bg-[#00A05D] focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
} 