'use client';

import { EstimateStatus } from '@/types/estimate';

interface EstimatesStatusTabsProps {
  currentStatus: EstimateStatus | 'ALL';
  onStatusChange: (status: EstimateStatus | 'ALL') => void;
  counts: {
    all: number;
    pending: number;
    approved: number;
    declined: number;
  };
}

export default function EstimatesStatusTabs({
  currentStatus,
  onStatusChange,
  counts,
}: EstimatesStatusTabsProps) {
  const tabs = [
    { name: 'All', value: 'ALL', count: counts.all },
    { name: 'Pending', value: 'PENDING', count: counts.pending },
    { name: 'Approved', value: 'APPROVED', count: counts.approved },
    { name: 'Declined', value: 'DECLINED', count: counts.declined },
  ] as const;

  return (
    <div className="border-b border-[#E2E8F0]">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className={`
              whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
              ${
                currentStatus === tab.value
                  ? 'border-[#00B86B] text-[#00B86B]'
                  : 'border-transparent text-[#64748B] hover:border-[#94A3B8] hover:text-[#0F172A]'
              }
            `}
          >
            {tab.name}
            {tab.count > 0 && (
              <span
                className={`ml-3 rounded-full px-2.5 py-0.5 text-xs font-medium
                ${
                  currentStatus === tab.value
                    ? 'bg-[#DCFCE7] text-[#00B86B]'
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }
              `}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
} 