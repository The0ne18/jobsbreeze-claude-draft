import { z } from 'zod';
import { SimpleClient } from './client';

// Type for line items
export interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category: string;
}

// Zod schema for estimate validation
export const estimateSchema = z.object({
  clientId: z.number(),
  date: z.date(),
  expiryDate: z.date().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  taxRate: z.number().min(0),
  lineItems: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0),
    unitPrice: z.number().min(0),
    amount: z.number().min(0),
    category: z.string().min(1, 'Category is required'),
  })),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  amount: z.number().min(0),
});

// Type for estimate form data
export type EstimateFormData = z.infer<typeof estimateSchema>;

// Interface for estimate data
export interface Estimate extends Omit<EstimateFormData, 'date' | 'expiryDate'> {
  id: number;
  estimateId: string;
  status: EstimateStatus;
  isDraft: boolean;
  date: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  client: SimpleClient;
}

// Estimate status types
export type EstimateStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

// Type for grouped estimates by month
export interface EstimateGroup {
  month: string;
  estimates: Estimate[];
} 