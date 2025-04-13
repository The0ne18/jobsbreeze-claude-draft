import { z } from 'zod';
import { Client } from './client';

// Type for line items
export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Invoice status types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

// Interface for invoice data
export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  client: {
    name: string;
    email: string;
  };
  status: InvoiceStatus;
  total: number;
  dueDate: Date;
  createdAt: Date;
  lineItems: LineItem[];
}

// Type for grouped invoices by month
export interface InvoiceGroup {
  month: string;
  invoices: Invoice[];
} 