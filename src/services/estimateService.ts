import { ApiClient, ApiError } from '@/lib/api/client';
import { Estimate, LineItem } from '@/types/estimate';
import config from '@/lib/config';

class EstimateService {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient(config.api.baseUrl);
  }

  async getEstimates(): Promise<Estimate[]> {
    try {
      return await this.api.get<Estimate[]>('/estimates');
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to fetch estimates:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getEstimate(id: number): Promise<Estimate> {
    try {
      return await this.api.get<Estimate>(`/estimates/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to fetch estimate ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createEstimate(estimate: Omit<Estimate, 'id' | 'createdAt'>): Promise<Estimate> {
    try {
      return await this.api.post<Estimate>('/estimates', estimate);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to create estimate:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateEstimate(id: number, estimate: Partial<Estimate>): Promise<Estimate> {
    try {
      return await this.api.put<Estimate>(`/estimates/${id}`, estimate);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to update estimate ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteEstimate(id: number): Promise<void> {
    try {
      await this.api.delete(`/estimates/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to delete estimate ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async addLineItem(estimateId: number, lineItem: Omit<LineItem, 'id'>): Promise<LineItem> {
    try {
      return await this.api.post<LineItem>(`/estimates/${estimateId}/line-items`, lineItem);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to add line item to estimate ${estimateId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateLineItem(estimateId: number, lineItemId: number, lineItem: Partial<LineItem>): Promise<LineItem> {
    try {
      return await this.api.put<LineItem>(`/estimates/${estimateId}/line-items/${lineItemId}`, lineItem);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to update line item ${lineItemId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteLineItem(estimateId: number, lineItemId: number): Promise<void> {
    try {
      await this.api.delete(`/estimates/${estimateId}/line-items/${lineItemId}`);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to delete line item ${lineItemId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export const estimateService = new EstimateService(); 