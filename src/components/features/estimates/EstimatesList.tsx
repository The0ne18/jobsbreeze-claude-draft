'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { PencilIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

interface Estimate {
  id: number;
  estimateId: string;
  clientId: number;
  client: {
    name: string;
  };
  status: string;
  isDraft: boolean;
  amount: number;
  date: string;
}

interface EstimateGroup {
  month: string;
  totalAmount: number;
  estimates: Estimate[];
}

interface EstimatesListProps {
  status: string;
  searchQuery: string;
}

export default function EstimatesList({ status, searchQuery }: EstimatesListProps) {
  const [estimateGroups, setEstimateGroups] = useState<EstimateGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        console.log(`Fetching estimates with status: ${status}, search: ${searchQuery}`);
        const response = await fetch(
          `/api/estimates?status=${encodeURIComponent(status)}&search=${encodeURIComponent(searchQuery)}`
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch estimates: ${response.status} ${response.statusText}`);
        }

        const estimates: Estimate[] = await response.json();
        console.log(`Received ${estimates.length} estimates`);
        
        if (estimates.length === 0) {
          setEstimateGroups([]);
          setIsLoading(false);
          return;
        }
        
        // Group estimates by month
        const groups = estimates.reduce((acc: { [key: string]: EstimateGroup }, estimate) => {
          const month = format(new Date(estimate.date), 'MMMM yyyy');
          
          if (!acc[month]) {
            acc[month] = {
              month,
              totalAmount: 0,
              estimates: [],
            };
          }
          
          acc[month].estimates.push(estimate);
          acc[month].totalAmount += estimate.amount;
          
          return acc;
        }, {});

        // Sort groups by date (newest first) and estimates within groups
        const sortedGroups = Object.values(groups)
          .sort((a, b) => 
            new Date(b.estimates[0].date).getTime() - new Date(a.estimates[0].date).getTime()
          )
          .map(group => ({
            ...group,
            estimates: group.estimates.sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
          }));

        setEstimateGroups(sortedGroups);
      } catch (err) {
        console.error('Error fetching estimates:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching estimates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstimates();
  }, [status, searchQuery]);

  if (isLoading) {
    return <div className="text-center py-8">Loading estimates...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (estimateGroups.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No estimates found for the selected criteria.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {estimateGroups.map((group) => (
        <div key={group.month} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{group.month}</h3>
            <p className="text-sm text-gray-500">
              Total: ${group.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Estimate ID
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Client
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {group.estimates.map((estimate) => (
                  <tr key={estimate.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {estimate.estimateId}
                        </span>
                        {estimate.isDraft && (
                          <span className="ml-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            Draft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(new Date(estimate.date), 'MMMM d, yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {estimate.client.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      ${estimate.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/dashboard/estimates/${estimate.id}`}
                          className="text-gray-400 hover:text-gray-900"
                        >
                          <FolderOpenIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/dashboard/estimates/${estimate.id}/edit`}
                          className="text-gray-400 hover:text-gray-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
} 