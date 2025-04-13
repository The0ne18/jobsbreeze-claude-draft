import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LineItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface LineItemsProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export function LineItems({ items, onChange }: LineItemsProps) {
  const addItem = () => {
    const newItem: LineItem = {
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...items];
    const item = { ...updatedItems[index] };
    
    if (field === 'quantity' || field === 'rate') {
      const numValue = parseFloat(value as string) || 0;
      item[field] = numValue;
      item.amount = item.quantity * item.rate;
    } else {
      item[field] = value;
    }
    
    updatedItems[index] = item;
    onChange(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="flex-1">
            <Input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              placeholder="Description"
              className="w-full"
            />
          </div>
          <div className="w-24">
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              min="1"
              className="w-full"
            />
          </div>
          <div className="w-32">
            <Input
              type="number"
              value={item.rate}
              onChange={(e) => updateItem(index, 'rate', e.target.value)}
              placeholder="Rate"
              min="0"
              step="0.01"
              className="w-full"
            />
          </div>
          <div className="w-32">
            <div className="h-10 flex items-center px-3 bg-gray-50 border border-[#E2E8F0] rounded-lg text-[#0F172A]">
              ${item.amount.toFixed(2)}
            </div>
          </div>
          <Button
            type="button"
            onClick={() => removeItem(index)}
            className="p-2 text-[#64748B] hover:text-[#0F172A]"
          >
            <TrashIcon className="w-5 h-5" />
          </Button>
        </div>
      ))}
      
      <div>
        <Button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 text-[#00B86B] hover:text-[#00A05D]"
        >
          <PlusIcon className="w-5 h-5" />
          Add Line Item
        </Button>
      </div>
    </div>
  );
} 