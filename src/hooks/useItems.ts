import { useState, useCallback } from 'react';
import { Item } from '@/types/item';

// Mock data for initial development
const mockItems: Item[] = [
  { id: '1', name: 'sheet', category: 'materials', price: 50.00 },
  { id: '2', name: 'wood', category: 'materials', price: 100.00 },
];

export function useItems() {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      setItems(mockItems);
    } catch (err) {
      setError('Failed to fetch items');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new item
  const addItem = useCallback(async (item: Omit<Item, 'id'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      const newItem: Item = {
        ...item,
        id: `item-${Date.now()}`,
      };
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError('Failed to add item');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update an existing item
  const updateItem = useCallback(async (id: string, item: Partial<Item>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      setItems(prev => prev.map(i => 
        i.id === id ? { ...i, ...item } : i
      ));
      return items.find(i => i.id === id) || null;
    } catch (err) {
      setError('Failed to update item');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  // Delete an item
  const deleteItem = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setError('Failed to delete item');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    items,
    isLoading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  };
} 