'use client';

import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { ClientForm } from '@/components/features/clients';
import Dialog from '@/components/ui/Dialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Client, ClientFormData } from '@/types/client';
import { useClients } from '@/hooks/useClients';
import { useRouter } from 'next/navigation';

export default function ClientsPage() {
  const router = useRouter();
  const { clients, isLoading, error, addClient, updateClient, deleteClient, isAdding, isUpdating, isDeleting } = useClients();
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isDeletingClient, setIsDeletingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleAddClient = async (data: ClientFormData) => {
    try {
      await addClient(data);
      setIsAddingClient(false);
    } catch (error) {
      console.error('Error adding client:', error);
      throw error; // Let the form handle the error
    }
  };

  const handleEditClient = async (data: ClientFormData) => {
    if (!editingClient) return;
    try {
      await updateClient({ id: editingClient.id, data });
      setEditingClient(null);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error; // Let the form handle the error
    }
  };

  const handleDeleteClient = async () => {
    if (!isDeletingClient) return;
    try {
      setLoadingStates(prev => ({ ...prev, [isDeletingClient.id]: true }));
      await deleteClient(isDeletingClient.id);
      setIsDeletingClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, [isDeletingClient.id]: false }));
    }
  };

  const handleViewInvoices = (clientId: string) => {
    router.push(`/dashboard/invoices?clientId=${clientId}`);
  };

  const filteredClients = useMemo(() => 
    clients.filter((client: Client) => 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.phone ? client.phone.toLowerCase().includes(searchQuery.toLowerCase()) : false)
    ),
    [clients, searchQuery]
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-red-500 mb-4">{error.message || 'An error occurred while loading clients'}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center rounded-lg bg-[#00B86B] px-4 py-2 text-sm font-medium text-white hover:bg-[#00B86B]/90 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 shadow-sm transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-semibold text-[#0F172A]">Clients</h1>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <MagnifyingGlassIcon className="h-5 w-5 text-[#94A3B8]" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border border-[#E2E8F0] bg-white py-3 pl-11 pr-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
              placeholder="Search clients..."
            />
          </div>
          <button
            onClick={() => setIsAddingClient(true)}
            className="inline-flex items-center rounded-lg bg-[#00B86B] px-6 py-3 text-sm font-medium text-white hover:bg-[#00B86B]/90 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 shadow-sm transition-colors"
          >
            Add Client
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
            <table className="min-w-full divide-y divide-[#E2E8F0]">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Phone</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#64748B] uppercase tracking-wider">Address</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-[#64748B] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#64748B]">
                      {searchQuery ? 'No clients found matching your search.' : 'No clients found. Add a client to get started.'}
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0F172A]">{client.name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0F172A]">{client.email}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0F172A]">{client.phone}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-[#0F172A]">{client.address}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button 
                          onClick={() => setEditingClient(client)}
                          disabled={loadingStates[client.id]}
                          className="text-[#94A3B8] hover:text-[#0F172A] transition-colors mx-2 focus:outline-none focus:text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => setIsDeletingClient(client)}
                          disabled={loadingStates[client.id]}
                          className="text-[#94A3B8] hover:text-[#0F172A] transition-colors mx-2 focus:outline-none focus:text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleViewInvoices(client.id)}
                          disabled={loadingStates[client.id]}
                          className="text-[#94A3B8] hover:text-[#0F172A] transition-colors mx-2 focus:outline-none focus:text-[#0F172A] disabled:opacity-50 disabled:cursor-not-allowed"
                          title="View client's invoices"
                        >
                          <DocumentIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Client Dialog */}
        <Dialog
          isOpen={isAddingClient}
          onClose={() => setIsAddingClient(false)}
          title="Add New Client"
        >
          <ClientForm
            onSubmit={handleAddClient}
            onCancel={() => setIsAddingClient(false)}
            isLoading={isAdding}
          />
        </Dialog>

        {/* Edit Client Dialog */}
        <Dialog
          isOpen={!!editingClient}
          onClose={() => setEditingClient(null)}
          title="Edit Client"
        >
          {editingClient && (
            <ClientForm
              initialData={editingClient}
              onSubmit={handleEditClient}
              onCancel={() => setEditingClient(null)}
              isLoading={isUpdating}
            />
          )}
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          isOpen={!!isDeletingClient}
          onClose={() => setIsDeletingClient(null)}
          title="Delete Client"
        >
          <div className="space-y-4">
            <p className="text-[#0F172A]">
              Are you sure you want to delete {isDeletingClient?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeletingClient(null)}
                className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClient}
                className="rounded-lg border border-transparent bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
} 