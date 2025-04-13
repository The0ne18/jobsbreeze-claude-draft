import { z } from 'zod';

export const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Client = z.infer<typeof clientSchema>;
export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>; 