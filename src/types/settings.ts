import { z } from 'zod';

// Define the business info schema
export const businessInfoSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().default(''),
  address: z.string().default(''),
  website: z.string().default(''),
});

// Define the default settings schema
export const defaultSettingsSchema = z.object({
  defaultTaxRate: z.coerce.number().min(0).max(100).default(0),
  estimateExpiry: z.coerce.number().min(1).default(30),
  invoiceDue: z.coerce.number().min(1).default(14),
  defaultTerms: z.string().default('Payment is due within 14 days of invoice date.'),
  defaultNotes: z.string().default('Thank you for your business!'),
});

// Define the settings schema
export const settingsSchema = z.object({
  businessInfo: businessInfoSchema,
  defaultSettings: defaultSettingsSchema,
});

// Define types based on the schemas
export type BusinessInfo = {
  businessName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
};

export type DefaultSettings = {
  defaultTaxRate: number;
  estimateExpiry: number;
  invoiceDue: number;
  defaultTerms: string;
  defaultNotes: string;
};

export type Settings = {
  businessInfo: BusinessInfo;
  defaultSettings: DefaultSettings;
}; 