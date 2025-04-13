'use client';

import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';

interface ClientSelectProps {
  value: string;
  onChange: (clientId: string) => void;
  error?: string;
}

export default function ClientSelect({ value, onChange, error }: ClientSelectProps) {
  const [query, setQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { clients, isLoading, error: clientsError, fetchClients } = useClients();

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (value && clients.length > 0) {
      const client = clients.find(c => c.id.toString() === value.toString());
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [value, clients]);

  const filteredClients = query === ''
    ? clients
    : clients.filter((client) =>
        client.name
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      );

  const handleSelect = (client: Client) => {
    setSelectedClient(client);
    onChange(client.id.toString());
  };

  return (
    <div className="w-full">
      <Combobox value={selectedClient} onChange={handleSelect}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Input
              className={`w-full rounded-lg border-0 py-3 pl-3 pr-10 text-gray-900 ring-1 ring-inset ${
                error ? 'ring-red-300' : 'ring-gray-300'
              } placeholder:text-gray-400 focus:ring-2 focus:ring-[#00B86B] sm:text-sm sm:leading-6`}
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(client: Client | null) => client?.name || ''}
              placeholder={isLoading ? 'Loading clients...' : 'Select a client...'}
              disabled={isLoading}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {isLoading ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Loading clients...
                </div>
              ) : clientsError ? (
                <div className="relative cursor-default select-none px-4 py-2 text-red-600">
                  Error loading clients. Please try again.
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  {query === '' ? 'No clients found.' : 'No matching clients found.'}
                </div>
              ) : (
                filteredClients.map((client) => (
                  <Combobox.Option
                    key={client.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-[#00B86B] text-white' : 'text-gray-900'
                      }`
                    }
                    value={client}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {client.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-[#00B86B]'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
} 