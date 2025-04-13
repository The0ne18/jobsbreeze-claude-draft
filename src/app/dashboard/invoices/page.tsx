'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Dialog from '@/components/ui/Dialog';
import { InvoicesList } from '@/components/features/invoices/InvoicesList';
import { InvoiceForm } from '@/components/features/invoices/form/InvoiceForm';

export default function InvoicesPage() {
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0F172A]">Invoices</h1>
        <Button onClick={() => setIsAddingInvoice(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="w-full max-w-sm">
        <Input
          type="search"
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-[#E2E8F0] rounded-lg"
        />
      </div>

      <InvoicesList searchQuery={searchQuery} />

      <Dialog
        isOpen={isAddingInvoice}
        onClose={() => setIsAddingInvoice(false)}
        title="New Invoice"
      >
        <InvoiceForm onSuccess={() => setIsAddingInvoice(false)} />
      </Dialog>
    </div>
  );
} 