import { z } from 'zod';
import { SimpleClient } from './client';

// Type for line items
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Invoice status types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

// Zod schema for invoice validation
export const invoiceSchema = z.object({
  number: z.string().min(1, 'Invoice number is required'),
  clientId: z.string(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
  total: z.number().min(0),
  dueDate: z.date(),
  lineItems: z.array(z.object({
    id: z.string(),
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0),
    rate: z.number().min(0),
    amount: z.number().min(0),
  })),
});

// Type for invoice form data
export type InvoiceFormData = z.infer<typeof invoiceSchema>;

// Interface for invoice data
export interface Invoice extends Omit<InvoiceFormData, 'clientId'> {
  id: string;
  clientId: string;
  client: SimpleClient;
  createdAt: string;
}

// Type for grouped invoices by month
export interface InvoiceGroup {
  month: string;
  invoices: Invoice[];
} 