import { useState, useCallback } from 'react';
import { Client, ClientFormData } from '@/types/client';
import { getClients, createClient, updateClient, deleteClient } from '@/services/clients';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all clients
  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      setError('Failed to fetch clients');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new client
  const addClient = useCallback(async (data: ClientFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newClient = await createClient(data);
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (err) {
      setError('Failed to add client');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing client
  const updateClientData = useCallback(async (id: number | string, data: ClientFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedClient = await updateClient(id, data);
      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
      return updatedClient;
    } catch (err) {
      setError('Failed to update client');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a client
  const removeClient = useCallback(async (id: number | string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteClient(id);
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      setError('Failed to delete client');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    clients,
    isLoading,
    error,
    fetchClients,
    addClient,
    updateClient: updateClientData,
    deleteClient: removeClient
  };
} 