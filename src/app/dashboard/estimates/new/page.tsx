'use client';

import EstimateForm from '@/components/features/estimates/form/EstimateForm';

export default function NewEstimatePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">New Estimate</h1>
        <p className="mt-2 text-sm text-gray-500">
          Create a new estimate by filling out the form below.
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <EstimateForm />
        </div>
      </div>
    </div>
  );
} 