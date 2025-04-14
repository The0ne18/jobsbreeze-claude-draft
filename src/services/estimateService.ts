import { ApiClient } from '@/lib/api/client';
import { ApiError } from '@/types/api';
import { Estimate, LineItem } from '@/types/estimate';
import config from '@/lib/config';

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

class EstimateService {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient(config.api.baseUrl);
  }

  async getEstimates(): Promise<Estimate[]> {
    try {
      return await this.api.get<Estimate[]>('/estimates');
    } catch (error) {
      if (isApiError(error)) {
        console.error('Failed to fetch estimates:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getEstimate(id: string): Promise<Estimate> {
    try {
      return await this.api.get<Estimate>(`/estimates/${id}`);
    } catch (error) {
      if (isApiError(error)) {
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
      if (isApiError(error)) {
        console.error('Failed to create estimate:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateEstimate(id: string, estimate: Partial<Estimate>): Promise<Estimate> {
    try {
      return await this.api.put<Estimate>(`/estimates/${id}`, estimate);
    } catch (error) {
      if (isApiError(error)) {
        console.error(`Failed to update estimate ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteEstimate(id: string): Promise<void> {
    try {
      await this.api.delete(`/estimates/${id}`);
    } catch (error) {
      if (isApiError(error)) {
        console.error(`Failed to delete estimate ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async addLineItem(estimateId: string, lineItem: Omit<LineItem, 'id'>): Promise<LineItem> {
    try {
      return await this.api.post<LineItem>(`/estimates/${estimateId}/line-items`, lineItem);
    } catch (error) {
      if (isApiError(error)) {
        console.error(`Failed to add line item to estimate ${estimateId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateLineItem(estimateId: string, lineItemId: string, lineItem: Partial<LineItem>): Promise<LineItem> {
    try {
      return await this.api.put<LineItem>(`/estimates/${estimateId}/line-items/${lineItemId}`, lineItem);
    } catch (error) {
      if (isApiError(error)) {
        console.error(`Failed to update line item ${lineItemId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteLineItem(estimateId: string, lineItemId: string): Promise<void> {
    try {
      await this.api.delete(`/estimates/${estimateId}/line-items/${lineItemId}`);
    } catch (error) {
      if (isApiError(error)) {
        console.error(`Failed to delete line item ${lineItemId}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export const estimateService = new EstimateService(); 