import { useCallback } from 'react';
import { Invoice, LineItem } from '@/types/invoice';
import { invoiceService } from '@/services/invoiceService';
import { useQuery } from './useQuery';
import { useMutation } from './useMutation';

const INVOICES_QUERY_KEY = 'invoices';

export function useInvoices() {
  const {
    data: invoices = [],
    isLoading: isLoadingInvoices,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useQuery<Invoice[]>({
    key: INVOICES_QUERY_KEY,
    queryFn: () => invoiceService.getInvoices(),
  });

  const { mutate: addInvoice, isLoading: isAddingInvoice } = useMutation<
    Invoice,
    Omit<Invoice, 'id' | 'createdAt'>
  >({
    mutationFn: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => invoiceService.createInvoice(invoice),
    onSuccess: async () => {
      await refetchInvoices();
    },
    invalidateQueries: [INVOICES_QUERY_KEY],
  });

  const { mutate: updateInvoice, isLoading: isUpdatingInvoice } = useMutation<
    Invoice,
    { id: number; invoice: Partial<Invoice> }
  >({
    mutationFn: ({ id, invoice }: { id: number; invoice: Partial<Invoice> }) => 
      invoiceService.updateInvoice(id, invoice),
    onSuccess: async () => {
      await refetchInvoices();
    },
    invalidateQueries: [INVOICES_QUERY_KEY],
  });

  const { mutate: deleteInvoice, isLoading: isDeletingInvoice } = useMutation<
    void,
    number
  >({
    mutationFn: (id: number) => invoiceService.deleteInvoice(id),
    onSuccess: async () => {
      await refetchInvoices();
    },
    invalidateQueries: [INVOICES_QUERY_KEY],
  });

  const { mutate: addLineItem, isLoading: isAddingLineItem } = useMutation<
    LineItem,
    { invoiceId: number; lineItem: Omit<LineItem, 'id'> }
  >({
    mutationFn: ({ invoiceId, lineItem }: { invoiceId: number; lineItem: Omit<LineItem, 'id'> }) =>
      invoiceService.addLineItem(invoiceId, lineItem),
    onSuccess: async () => {
      await refetchInvoices();
    },
    invalidateQueries: [INVOICES_QUERY_KEY],
  });

  const { mutate: updateLineItem, isLoading: isUpdatingLineItem } = useMutation<
    LineItem,
    { invoiceId: number; lineItemId: number; lineItem: Partial<LineItem> }
  >({
    mutationFn: ({ invoiceId, lineItemId, lineItem }: { 
      invoiceId: number; 
      lineItemId: number; 
      lineItem: Partial<LineItem> 
    }) => invoiceService.updateLineItem(invoiceId, lineItemId, lineItem),
    onSuccess: async () => {
      await refetchInvoices();
    },
    invalidateQueries: [INVOICES_QUERY_KEY],
  });

  const { mutate: deleteLineItem, isLoading: isDeletingLineItem } = useMutation<
    void,
    { invoiceId: number; lineItemId: number }
  >({
    mutationFn: ({ invoiceId, lineItemId }: { invoiceId: number; lineItemId: number }) =>
      invoiceService.deleteLineItem(invoiceId, lineItemId),
    onSuccess: async () => {
      await refetchInvoices();
    },
    invalidateQueries: [INVOICES_QUERY_KEY],
  });

  const handleUpdateInvoice = useCallback(
    (id: number, invoice: Partial<Invoice>) => {
      return updateInvoice({ id, invoice });
    },
    [updateInvoice]
  );

  const handleAddLineItem = useCallback(
    (invoiceId: number, lineItem: Omit<LineItem, 'id'>) => {
      return addLineItem({ invoiceId, lineItem });
    },
    [addLineItem]
  );

  const handleUpdateLineItem = useCallback(
    (invoiceId: number, lineItemId: number, lineItem: Partial<LineItem>) => {
      return updateLineItem({ invoiceId, lineItemId, lineItem });
    },
    [updateLineItem]
  );

  const handleDeleteLineItem = useCallback(
    (invoiceId: number, lineItemId: number) => {
      return deleteLineItem({ invoiceId, lineItemId });
    },
    [deleteLineItem]
  );

  return {
    invoices,
    isLoading:
      isLoadingInvoices ||
      isAddingInvoice ||
      isUpdatingInvoice ||
      isDeletingInvoice ||
      isAddingLineItem ||
      isUpdatingLineItem ||
      isDeletingLineItem,
    error: invoicesError,
    addInvoice,
    updateInvoice: handleUpdateInvoice,
    deleteInvoice,
    addLineItem: handleAddLineItem,
    updateLineItem: handleUpdateLineItem,
    deleteLineItem: handleDeleteLineItem,
  };
} 