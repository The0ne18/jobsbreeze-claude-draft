'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Estimate } from '@/types/estimate';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface EstimatesListProps {
  estimates: Estimate[];
  onEdit: (estimate: Estimate) => void;
  onDelete: (estimate: Estimate) => void;
}

export default function EstimatesList({ estimates, onEdit, onDelete }: EstimatesListProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Estimate;
    direction: 'asc' | 'desc';
  }>({
    key: 'createdAt',
    direction: 'desc',
  });

  const sortedEstimates = [...estimates].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === undefined || bValue === undefined) return 0;
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Estimate) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (key: keyof Estimate) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[#E2E8F0]">
        <thead>
          <tr className="text-left text-sm font-medium text-[#64748B]">
            <th
              className="whitespace-nowrap py-3.5 pl-4 pr-3 cursor-pointer hover:text-[#0F172A]"
              onClick={() => requestSort('estimateId')}
            >
              Estimate # {getSortIcon('estimateId')}
            </th>
            <th
              className="whitespace-nowrap px-3 py-3.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => requestSort('client')}
            >
              Client {getSortIcon('client')}
            </th>
            <th
              className="whitespace-nowrap px-3 py-3.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => requestSort('amount')}
            >
              Amount {getSortIcon('amount')}
            </th>
            <th
              className="whitespace-nowrap px-3 py-3.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => requestSort('status')}
            >
              Status {getSortIcon('status')}
            </th>
            <th
              className="whitespace-nowrap px-3 py-3.5 cursor-pointer hover:text-[#0F172A]"
              onClick={() => requestSort('createdAt')}
            >
              Created {getSortIcon('createdAt')}
            </th>
            <th className="whitespace-nowrap py-3.5 pl-3 pr-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">
          {sortedEstimates.map((estimate) => (
            <tr key={estimate.id} className="text-sm text-[#0F172A]">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 font-medium">
                #{estimate.estimateId}
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                {estimate.client.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                ${estimate.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    estimate.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : estimate.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {estimate.status.charAt(0) + estimate.status.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                {format(new Date(estimate.createdAt), 'MMM d, yyyy')}
              </td>
              <td className="whitespace-nowrap py-4 pl-3 pr-4">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => onEdit(estimate)}
                    className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus:outline-none"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span className="sr-only">Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(estimate)}
                    className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus:outline-none"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 