import { z } from 'zod';

// Zod schema for client validation
export const clientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

// Type for client form data
export type ClientFormData = z.infer<typeof clientSchema>;

// Type for client data with ID
export interface Client extends ClientFormData {
  id: number | string;
  createdAt?: Date;
  updatedAt?: Date;
} 