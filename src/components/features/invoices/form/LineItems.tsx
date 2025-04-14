import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LineItem } from '@/types/invoice';

interface LineItemsProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export function LineItems({ items, onChange }: LineItemsProps) {
  const addItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`, // Use string ID with timestamp
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
      (item as any)[field] = numValue;
      item.amount = item.quantity * item.rate;
    } else if (field === 'description') {
      item.description = value as string;
    } else if (field === 'id' && typeof value === 'string') {
      item.id = value;
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
      <div className="table-responsive">
        {items.length === 0 ? (
          <div className="py-8 text-center text-[#64748B] bg-gray-50 rounded-lg border border-[#E2E8F0]">
            No items added. Click "Add Line Item" to get started.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-[#E2E8F0]">
            <thead>
              <tr className="text-xs text-[#64748B] uppercase">
                <th className="px-3 py-3 text-left">Description</th>
                <th className="px-3 py-3 text-right w-20">Qty</th>
                <th className="px-3 py-3 text-right w-24">Rate</th>
                <th className="px-3 py-3 text-right w-24">Amount</th>
                <th className="px-3 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="px-3 py-2">
                    <Input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="w-full"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      min="1"
                      className="w-full text-right"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', e.target.value)}
                      placeholder="Rate"
                      min="0"
                      step="0.01"
                      className="w-full text-right"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="h-10 flex items-center justify-end px-3 bg-gray-50 border border-[#E2E8F0] rounded-lg text-[#0F172A]">
                      ${item.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-[#64748B] hover:text-[#0F172A]"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
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