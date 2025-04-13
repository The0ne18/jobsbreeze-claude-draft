import { useState, useCallback } from 'react';
import { Invoice } from '@/types/invoice';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '@/services/invoices';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all invoices
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getInvoices();
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new invoice
  const addInvoice = useCallback(async (data: Omit<Invoice, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newInvoice = await createInvoice(data);
      setInvoices(prev => [...prev, newInvoice]);
      return newInvoice;
    } catch (err) {
      setError('Failed to add invoice');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing invoice
  const updateInvoiceData = useCallback(async (id: string, data: Partial<Invoice>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedInvoice = await updateInvoice(id, data);
      setInvoices(prev => prev.map(invoice => 
        invoice.id === id ? updatedInvoice : invoice
      ));
      return updatedInvoice;
    } catch (err) {
      setError('Failed to update invoice');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete an invoice
  const removeInvoice = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteInvoice(id);
      setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    } catch (err) {
      setError('Failed to delete invoice');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    invoices,
    isLoading,
    error,
    fetchInvoices,
    addInvoice,
    updateInvoice: updateInvoiceData,
    deleteInvoice: removeInvoice
  };
} 