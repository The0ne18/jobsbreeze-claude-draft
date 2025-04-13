import { z } from 'zod';

// Base client schema for validation
export const clientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

// Type for client form data
export type ClientFormData = z.infer<typeof clientSchema>;

// Base client interface with all possible fields
export interface Client extends ClientFormData {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Simplified client interface for use in invoices and estimates
export interface SimpleClient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
} 