import { Estimate } from '@/types/estimate';

// Mock data for estimates
const mockEstimates: Estimate[] = [];

// Get all estimates
export async function getEstimates(): Promise<Estimate[]> {
  // TODO: Replace with actual API call
  return Promise.resolve(mockEstimates);
}

// Get estimate by ID
export async function getEstimateById(id: string): Promise<Estimate | null> {
  // TODO: Replace with actual API call
  const estimate = mockEstimates.find(e => e.id === id);
  return Promise.resolve(estimate || null);
}

// Create a new estimate
export async function createEstimate(estimate: Omit<Estimate, 'id'>): Promise<Estimate> {
  // TODO: Replace with actual API call
  const newEstimate: Estimate = {
    ...estimate,
    id: `est-${Date.now()}`
  };
  
  mockEstimates.push(newEstimate);
  return Promise.resolve(newEstimate);
}

// Update an existing estimate
export async function updateEstimate(id: string, estimate: Partial<Estimate>): Promise<Estimate> {
  // TODO: Replace with actual API call
  const index = mockEstimates.findIndex(e => e.id === id);
  
  if (index === -1) {
    throw new Error('Estimate not found');
  }
  
  const updatedEstimate = {
    ...mockEstimates[index],
    ...estimate,
    id
  };
  
  mockEstimates[index] = updatedEstimate;
  return Promise.resolve(updatedEstimate);
}

// Delete an estimate
export async function deleteEstimate(id: string): Promise<void> {
  // TODO: Replace with actual API call
  const index = mockEstimates.findIndex(e => e.id === id);
  
  if (index === -1) {
    throw new Error('Estimate not found');
  }
  
  mockEstimates.splice(index, 1);
  return Promise.resolve();
} 