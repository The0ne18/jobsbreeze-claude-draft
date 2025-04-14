import { z } from 'zod';
import { SimpleClient } from './client';

// Type for line items
export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category: string;
}

// Estimate status type
export type EstimateStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

// Zod schema for estimate validation
export const estimateSchema = z.object({
  clientId: z.string(),
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
  id: string;
  estimateId: string;
  status: EstimateStatus;
  isDraft: boolean;
  date: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  client: SimpleClient;
}

// Type for grouped estimates by month
export interface EstimateGroup {
  month: string;
  estimates: Estimate[];
} 