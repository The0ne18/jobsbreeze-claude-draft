import { Invoice } from '@/types/invoice';

// Mock data for invoices
const mockInvoices: Invoice[] = [];

// Get all invoices
export async function getInvoices(): Promise<Invoice[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockInvoices);
}

// Get invoice by ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  // TODO: Replace with actual API call
  const invoice = mockInvoices.find(i => i.id === id);
  return Promise.resolve(invoice || null);
}

// Create a new invoice
export async function createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
  // TODO: Replace with actual API call
  const newInvoice: Invoice = {
    ...invoice,
    id: `inv-${Date.now()}`
  };
  
  mockInvoices.push(newInvoice);
  return Promise.resolve(newInvoice);
}

// Update an existing invoice
export async function updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
  // TODO: Replace with actual API call
  const index = mockInvoices.findIndex(i => i.id === id);
  
  if (index === -1) {
    throw new Error('Invoice not found');
  }
  
  const updatedInvoice = {
    ...mockInvoices[index],
    ...invoice,
    id
  };
  
  mockInvoices[index] = updatedInvoice;
  return Promise.resolve(updatedInvoice);
}

// Delete an invoice
export async function deleteInvoice(id: string): Promise<void> {
  // TODO: Replace with actual API call
  const index = mockInvoices.findIndex(i => i.id === id);
  
  if (index === -1) {
    throw new Error('Invoice not found');
  }
  
  mockInvoices.splice(index, 1);
  return Promise.resolve();
} 