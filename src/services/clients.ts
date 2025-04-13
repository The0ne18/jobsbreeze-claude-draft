import { Client, ClientFormData } from '@/types/client';

// Temporary mock data
const mockClients: Client[] = [
  { id: 1, name: 'john ty', email: 'ljk@fasd.com', phone: '', address: '', notes: '' },
  { id: 2, name: 'John Smith', email: 'smith@gmail.com', phone: '', address: '', notes: '' },
  { id: 3, name: 'Test Client', email: 'cleint@gmail.com', phone: '4561235478', address: '', notes: '' },
];

// Get all clients
export async function getClients(): Promise<Client[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockClients);
}

// Get client by ID
export async function getClientById(id: number | string): Promise<Client | null> {
  // TODO: Replace with actual API call
  const client = mockClients.find(c => c.id === id);
  return Promise.resolve(client || null);
}

// Create a new client
export async function createClient(data: ClientFormData): Promise<Client> {
  // TODO: Replace with actual API call
  const newClient: Client = {
    ...data,
    id: Math.max(...mockClients.map(c => Number(c.id))) + 1,
    phone: data.phone || '',
    address: data.address || '',
    notes: data.notes || '',
  };
  
  mockClients.push(newClient);
  return Promise.resolve(newClient);
}

// Update an existing client
export async function updateClient(id: number | string, data: ClientFormData): Promise<Client> {
  // TODO: Replace with actual API call
  const index = mockClients.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error('Client not found');
  }
  
  const updatedClient: Client = {
    ...data,
    id,
    phone: data.phone || '',
    address: data.address || '',
    notes: data.notes || '',
  };
  
  mockClients[index] = updatedClient;
  return Promise.resolve(updatedClient);
}

// Delete a client
export async function deleteClient(id: number | string): Promise<void> {
  // TODO: Replace with actual API call
  const index = mockClients.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error('Client not found');
  }
  
  mockClients.splice(index, 1);
  return Promise.resolve();
} 