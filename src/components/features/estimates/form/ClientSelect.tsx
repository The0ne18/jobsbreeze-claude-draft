'use client';

import { Control, Controller, FieldError } from 'react-hook-form';
import { EstimateFormData } from '@/types/estimate';
import { SimpleClient } from '@/types/client';
import { useEffect, useState } from 'react';

interface ClientSelectProps {
  control: Control<EstimateFormData>;
  error?: FieldError;
}

export default function ClientSelect({ control, error }: ClientSelectProps) {
  const [clients, setClients] = useState<SimpleClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div>
      <label htmlFor="clientId" className="block text-sm font-medium text-[#0F172A]">
        Client
      </label>
      <Controller
        name="clientId"
        control={control}
        render={({ field }) => (
          <select
            id="clientId"
            {...field}
            className={`mt-2 block w-full rounded-lg border-[#E2E8F0] bg-white shadow-sm focus:border-[#00B86B] focus:ring-[#00B86B] ${
              error ? 'border-red-300' : ''
            }`}
            disabled={isLoading}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        )}
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">{error.message}</p>
      )}
    </div>
  );
} 