'use client';

import { ComponentType } from 'react';
import { HeroIcon } from '@/lib/types';

type QuickActionProps = {
  title: string;
  Icon: ComponentType<HeroIcon>;
  color: string;
  onClick: () => void;
};

export default function QuickAction({ title, Icon, color, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white rounded-lg p-6 flex items-center justify-center flex-col flex-1`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <span>{title}</span>
    </button>
  );
} 