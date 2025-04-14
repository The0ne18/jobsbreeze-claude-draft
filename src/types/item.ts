import { z } from 'zod';

// Zod schema for item validation
export const itemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(['materials', 'labor', 'equipment', 'other']),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  taxable: z.boolean().optional().default(false),
});

// Type for item form data
export type ItemFormData = Omit<Item, 'id'>;

// Type for item data with ID
export type Item = z.infer<typeof itemSchema>; 