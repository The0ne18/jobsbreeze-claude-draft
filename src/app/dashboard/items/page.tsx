'use client';

import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useItems } from '@/hooks';
import { ItemFormData } from '@/types/item';
import Dialog from '@/components/ui/Dialog';
import ItemForm from '@/components/features/items/ItemForm';

export default function ItemsPage() {
  const { items, isLoading, error, fetchItems, addItem, updateItem, deleteItem } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = async (data: ItemFormData) => {
    setIsSubmitting(true);
    try {
      await addItem(data);
      setIsAddingItem(false);
    } catch (error) {
      console.error('Failed to create item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateItem = async (data: ItemFormData) => {
    if (!editingItem?.id) return;
    
    setIsSubmitting(true);
    try {
      await updateItem(editingItem.id, data);
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!isDeleting) return;
    
    setIsSubmitting(true);
    try {
      await deleteItem(isDeleting);
      setIsDeleting(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          onClick={() => setIsAddingItem(true)}
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
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-6 rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
              <div>
                <h3 className="text-lg font-medium text-[#0F172A]">{item.name}</h3>
                <div className="flex items-center mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-[#E0F2FE] text-[#0369A1] capitalize">
                    {item.category}
                  </span>
                  {item.taxable && (
                    <span className="inline-block ml-2 px-2 py-1 text-xs font-medium rounded-md bg-[#DCFCE7] text-[#166534]">
                      Taxable
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-2 text-sm text-[#64748B]">{item.description}</p>
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-8 text-xl font-semibold text-[#0F172A]">
                  ${item.price.toFixed(2)}
                </span>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                    onClick={() => setEditingItem(item)}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-[#64748B] hover:text-red-500 transition-colors"
                    onClick={() => item.id && setIsDeleting(String(item.id))}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
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

      {/* Add Item Dialog */}
      <Dialog
        isOpen={isAddingItem}
        onClose={() => setIsAddingItem(false)}
        title="Add New Item"
      >
        <ItemForm
          onSubmit={handleAddItem}
          onCancel={() => setIsAddingItem(false)}
          isSubmitting={isSubmitting}
        />
      </Dialog>

      {/* Edit Item Dialog */}
      {editingItem && (
        <Dialog
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="Edit Item"
        >
          <ItemForm
            initialData={{
              name: editingItem.name,
              description: editingItem.description || '',
              category: editingItem.category,
              price: editingItem.price,
              taxable: editingItem.taxable || false,
            }}
            onSubmit={handleUpdateItem}
            onCancel={() => setEditingItem(null)}
            isSubmitting={isSubmitting}
          />
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!isDeleting}
        onClose={() => setIsDeleting(null)}
        title="Delete Item"
      >
        <div className="space-y-4">
          <p className="text-[#0F172A]">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsDeleting(null)}
              className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteItem}
              disabled={isSubmitting}
              className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 