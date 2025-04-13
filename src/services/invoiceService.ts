import { ApiClient, ApiError } from '@/lib/api/client';
import { Invoice, LineItem } from '@/types/invoice';
import config from '@/lib/config';

class InvoiceService {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient(config.api.baseUrl);
  }

  async getInvoices(): Promise<Invoice[]> {
    try {
      return await this.api.get<Invoice[]>('/invoices');
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to fetch invoices:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getInvoice(id: number): Promise<Invoice> {
    try {
      return await this.api.get<Invoice>(`/invoices/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to fetch invoice ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
    try {
      return await this.api.post<Invoice>('/invoices', invoice);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to create invoice:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice> {
    try {
      return await this.api.put<Invoice>(`/invoices/${id}`, invoice);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to update invoice ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteInvoice(id: number): Promise<void> {
    try {
      await this.api.delete(`/invoices/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to delete invoice ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async addLineItem(invoiceId: number, lineItem: Omit<LineItem, 'id'>): Promise<LineItem> {
    try {
      return await this.api.post<LineItem>(`/invoices/${invoiceId}/line-items`, lineItem);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to add line item to invoice ${invoiceId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateLineItem(invoiceId: number, lineItemId: number, lineItem: Partial<LineItem>): Promise<LineItem> {
    try {
      return await this.api.put<LineItem>(`/invoices/${invoiceId}/line-items/${lineItemId}`, lineItem);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to update line item ${lineItemId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteLineItem(invoiceId: number, lineItemId: number): Promise<void> {
    try {
      await this.api.delete(`/invoices/${invoiceId}/line-items/${lineItemId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to delete line item ${lineItemId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export const invoiceService = new InvoiceService(); 