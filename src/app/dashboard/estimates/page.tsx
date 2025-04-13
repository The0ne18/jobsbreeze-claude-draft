'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import EstimatesList from '@/components/features/estimates/EstimatesList';
import EstimatesHeader from '@/components/features/estimates/EstimatesHeader';
import EstimatesStatusTabs from '@/components/features/estimates/EstimatesStatusTabs';
import EstimateForm from '@/components/features/estimates/form/EstimateForm';
import SlideOver from '@/components/ui/SlideOver';

export default function EstimatesPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewEstimateOpen, setIsNewEstimateOpen] = useState(false);
  const status = searchParams.get('status') || 'PENDING';

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsNewEstimateOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <EstimatesHeader 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
        onNewEstimate={() => setIsNewEstimateOpen(true)}
      />
      <EstimatesStatusTabs activeStatus={status} />
      <EstimatesList 
        status={status} 
        searchQuery={searchQuery} 
      />

      <SlideOver
        open={isNewEstimateOpen}
        onClose={() => setIsNewEstimateOpen(false)}
        title="New Estimate"
      >
        <EstimateForm onSuccess={() => setIsNewEstimateOpen(false)} />
      </SlideOver>
    </div>
  );
} 