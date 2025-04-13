import { useState } from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface SwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Switch({ defaultChecked = false, onChange }: SwitchProps) {
  const [enabled, setEnabled] = useState(defaultChecked);

  const handleChange = (checked: boolean) => {
    setEnabled(checked);
    onChange?.(checked);
  };

  return (
    <HeadlessSwitch
      checked={enabled}
      onChange={handleChange}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:ring-offset-2',
        enabled ? 'bg-[#00B86B]' : 'bg-[#E2E8F0]'
      )}
    >
      <span className="sr-only">Enable item tax</span>
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </HeadlessSwitch>
  );
} 