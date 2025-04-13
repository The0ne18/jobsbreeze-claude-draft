import { LineItem } from './invoice';

// Estimate status types
export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

// Interface for estimate data
export interface Estimate {
  id: string;
  number: string;
  clientId: string;
  client: {
    name: string;
    email: string;
  };
  status: EstimateStatus;
  total: number;
  date: Date;
  expiryDate: Date;
  createdAt: Date;
  lineItems: LineItem[];
}

// Type for grouped estimates by month
export interface EstimateGroup {
  month: string;
  estimates: Estimate[];
} 