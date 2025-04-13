'use client';

import { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useItems } from '@/hooks';
import { Item } from '@/types/item';

export default function ItemsPage() {
  const { items, isLoading, error, fetchItems } = useItems();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter((item: Item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-[#0F172A]">Items</h1>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-[#E2E8F0] bg-white py-3 px-4 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B86B] focus:border-[#00B86B] shadow-sm"
            placeholder="Search items..."
          />
        </div>
        <button
          onClick={() => {}}
          className="inline-flex items-center rounded-lg bg-[#00B86B] px-6 py-3 text-sm font-medium text-white hover:bg-[#00B86B]/90 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 shadow-sm transition-colors"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Item
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p className="text-[#64748B]">Loading items...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item: Item) => (
            <div key={item.id} className="flex items-center justify-between p-6 rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
              <div>
                <h3 className="text-lg font-medium text-[#0F172A]">{item.name}</h3>
                <span className="inline-block px-2 py-1 mt-2 text-xs font-medium rounded-md bg-[#E0F2FE] text-[#0369A1]">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-8 text-xl font-semibold text-[#0F172A]">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                  onClick={() => {}}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-[#64748B] bg-white rounded-lg border border-[#E2E8F0]">
              No items found. Try adjusting your search or add a new item.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 