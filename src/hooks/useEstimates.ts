import { useState, useCallback } from 'react';
import { Estimate } from '@/types/estimate';
import { getEstimates, createEstimate, updateEstimate, deleteEstimate } from '@/services/estimates';

export function useEstimates() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all estimates
  const fetchEstimates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getEstimates();
      setEstimates(data);
    } catch (err) {
      setError('Failed to fetch estimates');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new estimate
  const addEstimate = useCallback(async (data: Omit<Estimate, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newEstimate = await createEstimate(data);
      setEstimates(prev => [...prev, newEstimate]);
      return newEstimate;
    } catch (err) {
      setError('Failed to add estimate');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing estimate
  const updateEstimateData = useCallback(async (id: string, data: Partial<Estimate>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedEstimate = await updateEstimate(id, data);
      setEstimates(prev => prev.map(estimate => 
        estimate.id === id ? updatedEstimate : estimate
      ));
      return updatedEstimate;
    } catch (err) {
      setError('Failed to update estimate');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete an estimate
  const removeEstimate = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteEstimate(id);
      setEstimates(prev => prev.filter(estimate => estimate.id !== id));
    } catch (err) {
      setError('Failed to delete estimate');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    estimates,
    isLoading,
    error,
    fetchEstimates,
    addEstimate,
    updateEstimate: updateEstimateData,
    deleteEstimate: removeEstimate
  };
} 