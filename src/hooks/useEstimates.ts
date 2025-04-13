import { useCallback } from 'react';
import { Estimate, LineItem } from '@/types/estimate';
import { estimateService } from '@/services/estimateService';
import { useQuery } from './useQuery';
import { useMutation } from './useMutation';

const ESTIMATES_QUERY_KEY = 'estimates';

export function useEstimates() {
  const {
    data: estimates = [],
    isLoading: isLoadingEstimates,
    error: estimatesError,
    refetch: refetchEstimates,
  } = useQuery<Estimate[]>({
    key: ESTIMATES_QUERY_KEY,
    queryFn: () => estimateService.getEstimates(),
  });

  const { mutate: addEstimate, isLoading: isAddingEstimate } = useMutation<
    Estimate,
    Omit<Estimate, 'id' | 'createdAt'>
  >({
    mutationFn: (estimate: Omit<Estimate, 'id' | 'createdAt'>) => estimateService.createEstimate(estimate),
    onSuccess: async () => {
      await refetchEstimates();
    },
    invalidateQueries: [ESTIMATES_QUERY_KEY],
  });

  const { mutate: updateEstimate, isLoading: isUpdatingEstimate } = useMutation<
    Estimate,
    { id: number; estimate: Partial<Estimate> }
  >({
    mutationFn: ({ id, estimate }: { id: number; estimate: Partial<Estimate> }) => 
      estimateService.updateEstimate(id, estimate),
    onSuccess: async () => {
      await refetchEstimates();
    },
    invalidateQueries: [ESTIMATES_QUERY_KEY],
  });

  const { mutate: deleteEstimate, isLoading: isDeletingEstimate } = useMutation<
    void,
    number
  >({
    mutationFn: (id: number) => estimateService.deleteEstimate(id),
    onSuccess: async () => {
      await refetchEstimates();
    },
    invalidateQueries: [ESTIMATES_QUERY_KEY],
  });

  const { mutate: addLineItem, isLoading: isAddingLineItem } = useMutation<
    LineItem,
    { estimateId: number; lineItem: Omit<LineItem, 'id'> }
  >({
    mutationFn: ({ estimateId, lineItem }: { estimateId: number; lineItem: Omit<LineItem, 'id'> }) =>
      estimateService.addLineItem(estimateId, lineItem),
    onSuccess: async () => {
      await refetchEstimates();
    },
    invalidateQueries: [ESTIMATES_QUERY_KEY],
  });

  const { mutate: updateLineItem, isLoading: isUpdatingLineItem } = useMutation<
    LineItem,
    { estimateId: number; lineItemId: number; lineItem: Partial<LineItem> }
  >({
    mutationFn: ({ estimateId, lineItemId, lineItem }: { 
      estimateId: number; 
      lineItemId: number; 
      lineItem: Partial<LineItem> 
    }) => estimateService.updateLineItem(estimateId, lineItemId, lineItem),
    onSuccess: async () => {
      await refetchEstimates();
    },
    invalidateQueries: [ESTIMATES_QUERY_KEY],
  });

  const { mutate: deleteLineItem, isLoading: isDeletingLineItem } = useMutation<
    void,
    { estimateId: number; lineItemId: number }
  >({
    mutationFn: ({ estimateId, lineItemId }: { estimateId: number; lineItemId: number }) =>
      estimateService.deleteLineItem(estimateId, lineItemId),
    onSuccess: async () => {
      await refetchEstimates();
    },
    invalidateQueries: [ESTIMATES_QUERY_KEY],
  });

  const handleUpdateEstimate = useCallback(
    (id: number, estimate: Partial<Estimate>) => {
      return updateEstimate({ id, estimate });
    },
    [updateEstimate]
  );

  const handleAddLineItem = useCallback(
    (estimateId: number, lineItem: Omit<LineItem, 'id'>) => {
      return addLineItem({ estimateId, lineItem });
    },
    [addLineItem]
  );

  const handleUpdateLineItem = useCallback(
    (estimateId: number, lineItemId: number, lineItem: Partial<LineItem>) => {
      return updateLineItem({ estimateId, lineItemId, lineItem });
    },
    [updateLineItem]
  );

  const handleDeleteLineItem = useCallback(
    (estimateId: number, lineItemId: number) => {
      return deleteLineItem({ estimateId, lineItemId });
    },
    [deleteLineItem]
  );

  return {
    estimates,
    isLoading:
      isLoadingEstimates ||
      isAddingEstimate ||
      isUpdatingEstimate ||
      isDeletingEstimate ||
      isAddingLineItem ||
      isUpdatingLineItem ||
      isDeletingLineItem,
    error: estimatesError,
    addEstimate,
    updateEstimate: handleUpdateEstimate,
    deleteEstimate,
    addLineItem: handleAddLineItem,
    updateLineItem: handleUpdateLineItem,
    deleteLineItem: handleDeleteLineItem,
  };
} 