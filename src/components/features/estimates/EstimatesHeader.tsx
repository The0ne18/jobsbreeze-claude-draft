'use client';

import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

interface EstimatesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNewEstimate: () => void;
}

export default function EstimatesHeader({ 
  searchQuery, 
  onSearchChange,
  onNewEstimate,
}: EstimatesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search estimates by client name, ID, or address..."
            className="block w-full rounded-lg border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-green-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="ml-4">
        <button
          type="button"
          onClick={onNewEstimate}
          className="inline-flex items-center gap-x-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          New Estimate
        </button>
      </div>
    </div>
  );
} 