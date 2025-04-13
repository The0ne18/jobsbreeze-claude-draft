import { ApiClient, ApiError } from '@/lib/api/client';
import { Client, SimpleClient } from '@/types/client';
import config from '@/lib/config';

class ClientService {
  private api: ApiClient;

  constructor() {
    this.api = new ApiClient(config.api.baseUrl);
  }

  async getClients(): Promise<Client[]> {
    try {
      return await this.api.get<Client[]>('/clients');
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to fetch clients:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getClient(id: number): Promise<Client> {
    try {
      return await this.api.get<Client>(`/clients/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to fetch client ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    try {
      return await this.api.post<Client>('/clients', client);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Failed to create client:', error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async updateClient(id: number, client: Partial<Client>): Promise<Client> {
    try {
      return await this.api.put<Client>(`/clients/${id}`, client);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to update client ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async deleteClient(id: number): Promise<void> {
    try {
      await this.api.delete(`/clients/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(`Failed to delete client ${id}:`, error.message);
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export const clientService = new ClientService(); 