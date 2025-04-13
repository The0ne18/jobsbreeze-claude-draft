'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

const tabs = [
  { name: 'Pending', value: 'PENDING' },
  { name: 'Approved', value: 'APPROVED' },
  { name: 'Declined', value: 'DECLINED' },
];

interface EstimatesStatusTabsProps {
  activeStatus: string;
}

export default function EstimatesStatusTabs({ activeStatus }: EstimatesStatusTabsProps) {
  const searchParams = useSearchParams();
  const currentSearchQuery = searchParams.get('search') || '';

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeStatus === tab.value;
          const href = `/dashboard/estimates?status=${tab.value}${
            currentSearchQuery ? `&search=${currentSearchQuery}` : ''
          }`;

          return (
            <Link
              key={tab.name}
              href={href}
              className={clsx(
                isActive
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 