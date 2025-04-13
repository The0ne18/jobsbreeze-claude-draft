'use client';

import { useState, useEffect } from 'react';
import { Item } from '@/types/item';

interface ItemSelectProps {
  onSelect: (item: Item) => void;
}

export default function ItemSelect({ onSelect }: ItemSelectProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('Fetching items...');
        const response = await fetch('/api/items');
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('API response data:', data);
        
        if (!response.ok) {
          setDebugInfo(`API error: ${response.status} - ${JSON.stringify(data)}`);
          throw new Error(data.error || 'Failed to fetch items');
        }

        if (Array.isArray(data)) {
          console.log(`Received ${data.length} items:`, data);
          setItems(data);
          if (data.length === 0) {
            setDebugInfo('API returned an empty array');
          }
        } else {
          setDebugInfo(`Invalid response format: ${JSON.stringify(data)}`);
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setError(error instanceof Error ? error.message : 'Failed to load items');
        setDebugInfo(`Exception: ${String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (isLoading) {
    return (
      <select disabled className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm">
        <option>Loading items...</option>
      </select>
    );
  }

  if (error) {
    return (
      <div>
        <select disabled className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 shadow-sm">
          <option>Error loading items</option>
        </select>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        {debugInfo && <p className="mt-1 text-xs text-gray-600">{debugInfo}</p>}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <select disabled className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm">
          <option>No items available</option>
        </select>
        {debugInfo && <p className="mt-1 text-xs text-gray-600">{debugInfo}</p>}
      </div>
    );
  }

  return (
    <select
      onChange={(e) => {
        const value = e.target.value;
        if (!value) return;
        
        console.log('Selected value:', value);
        const selectedItem = items.find(item => item.id === parseInt(value, 10));
        console.log('Selected item:', selectedItem);
        
        if (selectedItem) {
          onSelect(selectedItem);
        }
      }}
      className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
    >
      <option value="">Select from saved items...</option>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name} - ${item.price.toFixed(2)} ({item.category})
        </option>
      ))}
    </select>
  );
} 