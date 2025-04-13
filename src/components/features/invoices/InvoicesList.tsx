import { useState } from 'react';
import { format } from 'date-fns';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { InvoiceForm } from './form/InvoiceForm';

interface Invoice {
  id: string;
  number: string;
  clientId: string;
  client: {
    name: string;
    email: string;
  };
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  total: number;
  dueDate: Date;
  createdAt: Date;
  lineItems: Array<{
    id?: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

interface InvoiceGroup {
  month: string;
  invoices: Invoice[];
}

interface InvoicesListProps {
  searchQuery: string;
}

export function InvoicesList({ searchQuery }: InvoicesListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data - replace with actual data fetching
  const invoices: Invoice[] = [];

  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      invoice.number.toLowerCase().includes(searchLower) ||
      invoice.client.name.toLowerCase().includes(searchLower)
    );
  });

  const groupedInvoices: InvoiceGroup[] = filteredInvoices.reduce((groups, invoice) => {
    const month = format(new Date(invoice.createdAt), 'MMMM yyyy');
    const existingGroup = groups.find((g) => g.month === month);
    
    if (existingGroup) {
      existingGroup.invoices.push(invoice);
    } else {
      groups.push({ month, invoices: [invoice] });
    }
    
    return groups;
  }, [] as InvoiceGroup[]);

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditing(true);
  };

  const handleDelete = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvoice) return;
    // Add delete logic here
    setIsDeleting(false);
    setSelectedInvoice(null);
  };

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#64748B] text-lg">No invoices found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedInvoices.map((group) => (
        <div key={group.month}>
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">{group.month}</h2>
          <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
            <table className="min-w-full divide-y divide-[#E2E8F0]">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#64748B]">Number</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#64748B]">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#64748B]">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#64748B]">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#64748B]">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {group.invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 text-sm text-[#0F172A]">{invoice.number}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#0F172A]">{invoice.client.name}</div>
                      <div className="text-sm text-[#64748B]">{invoice.client.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0F172A]">
                      {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#0F172A]">
                      ${invoice.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => {}}>
                        <EyeIcon className="h-5 w-5 text-[#64748B]" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(invoice)}>
                        <PencilIcon className="h-5 w-5 text-[#64748B]" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(invoice)}>
                        <TrashIcon className="h-5 w-5 text-[#64748B]" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <Dialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Invoice"
      >
        {selectedInvoice && (
          <InvoiceForm
            invoice={selectedInvoice}
            onSuccess={() => setIsEditing(false)}
          />
        )}
      </Dialog>

      <Dialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Invoice"
      >
        <div className="space-y-4">
          <p className="text-[#0F172A]">
            Are you sure you want to delete this invoice? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 