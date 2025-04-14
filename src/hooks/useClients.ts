import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Client, ClientFormData } from '@/types/client';
import { ApiError } from '@/types/api';

const CLIENTS_QUERY_KEY = ['clients'] as const;

export function useClients() {
  const queryClient = useQueryClient();

  const {
    data: clients = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: async () => {
      return apiClient.get<Client[]>('/clients');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const addClientMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      return apiClient.post<Client>('/clients', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClientFormData }) => {
      return apiClient.put<Client>(`/clients/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });

  return {
    clients,
    isLoading,
    error,
    addClient: addClientMutation.mutateAsync,
    updateClient: updateClientMutation.mutateAsync,
    deleteClient: deleteClientMutation.mutateAsync,
    isAdding: addClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
} 