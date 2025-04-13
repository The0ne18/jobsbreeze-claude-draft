'use client';

import { PlusIcon } from '@heroicons/react/24/outline';

interface EstimatesHeaderProps {
  onCreateNew: () => void;
}

export default function EstimatesHeader({ onCreateNew }: EstimatesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[#0F172A]">Estimates</h1>
        <p className="mt-1 text-sm text-[#64748B]">
          Create and manage estimates for your clients
        </p>
      </div>
      <div>
        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center gap-x-1.5 rounded-lg bg-[#00B86B] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#00B86B]/90 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 shadow-sm"
        >
          <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          New Estimate
        </button>
      </div>
    </div>
  );
} 