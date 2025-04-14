export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category: string;
}

export interface EstimateFormData {
  clientId: string;
  date: Date;
  expiryDate?: Date;
  notes?: string;
  terms?: string;
  taxRate: number;
  lineItems: LineItem[];
}

export interface Estimate extends Omit<EstimateFormData, 'date' | 'expiryDate'> {
  id: string;
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