'use client';

import { ComponentType } from 'react';
import { HeroIcon } from '@/lib/types';

type StatsCardProps = {
  title: string;
  value: string | number;
  Icon: ComponentType<HeroIcon>;
  color: string;
};

export default function StatsCard({ title, value, Icon, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
} 