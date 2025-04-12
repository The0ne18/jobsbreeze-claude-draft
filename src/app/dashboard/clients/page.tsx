'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ClientForm from '@/components/forms/ClientForm';
import Dialog from '@/components/ui/Dialog';

// Temporary mock data
const initialClients = [
  { id: 1, name: 'john ty', email: 'ljk@fasd.com', phone: '', address: '', notes: '' },
  { id: 2, name: 'John Smith', email: 'smith@gmail.com', phone: '', address: '', notes: '' },
  { id: 3, name: 'Test Client', email: 'cleint@gmail.com', phone: '4561235478', address: '', notes: '' },
];

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isDeletingClient, setIsDeletingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddClient = async (data: Omit<Client, 'id'>) => {
    try {
      // TODO: Implement API call to save client
      const newClient = {
        ...data,
        id: clients.length + 1,
      };
      setClients([...clients, newClient]);
      setIsAddingClient(false);
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const handleEditClient = async (data: Omit<Client, 'id'>) => {
    if (!editingClient) return;
    try {
      // TODO: Implement API call to update client
      const updatedClients = clients.map(client =>
        client.id === editingClient.id ? { ...data, id: client.id } : client
      );
      setClients(updatedClients);
      setEditingClient(null);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDeleteClient = async () => {
    if (!isDeletingClient) return;
    try {
      // TODO: Implement API call to delete client
      const updatedClients = clients.filter(client => client.id !== isDeletingClient.id);
      setClients(updatedClients);
      setIsDeletingClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Clients</h1>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500"
              placeholder="Search clients..."
            />
          </div>
          <button
            onClick={() => setIsAddingClient(true)}
            className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Add Client
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{client.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{client.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{client.phone}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{client.address}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button 
                      onClick={() => setEditingClient(client)}
                      className="text-gray-400 hover:text-gray-500 mx-2"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setIsDeletingClient(client)}
                      className="text-gray-400 hover:text-gray-500 mx-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-500 mx-2">
                      <DocumentIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Dialog */}
      <Dialog
        isOpen={isAddingClient}
        onClose={() => setIsAddingClient(false)}
        title="Add New Client"
      >
        <ClientForm
          onSubmit={handleAddClient}
          onCancel={() => setIsAddingClient(false)}
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
          <p className="text-sm text-gray-500">
            Are you sure you want to delete {isDeletingClient?.name}? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeletingClient(null)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteClient}
              className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  );
} 