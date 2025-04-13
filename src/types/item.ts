import { z } from 'zod';

// Zod schema for item validation
export const itemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  category: z.string().min(2, 'Category is required'),
  price: z.number().min(0, 'Price must be a positive number'),
});

// Type for item form data
export type ItemFormData = z.infer<typeof itemSchema>;

// Type for item data with ID
export interface Item extends ItemFormData {
  id: string;
} 