export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface EstimateFormData {
  clientId: number;
  date: Date;
  expiryDate?: Date;
  notes?: string;
  terms?: string;
  taxRate: number;
  lineItems: LineItem[];
}

export interface Estimate extends Omit<EstimateFormData, 'date' | 'expiryDate'> {
  id: number;
  estimateId: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  isDraft: boolean;
  amount: number;
  tax: number;
  subtotal: number;
  date: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
}

export type EstimateStatus = 'PENDING' | 'APPROVED' | 'DECLINED'; 