'use client';

import { useState } from 'react';

interface SettingsTabsProps {
  activeTab: 'business-info' | 'default-settings';
  setActiveTab: (tab: 'business-info' | 'default-settings') => void;
}

export default function SettingsTabs({ activeTab, setActiveTab }: SettingsTabsProps) {
  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <button
        onClick={() => setActiveTab('business-info')}
        className={`flex-1 text-[16px] font-medium py-3 px-6 transition-colors ${
          activeTab === 'business-info'
            ? 'text-[#0F172A] bg-white'
            : 'text-[#64748B] bg-[#F1F5F9] hover:text-[#0F172A]'
        }`}
      >
        Business Info
      </button>
      <button
        onClick={() => setActiveTab('default-settings')}
        className={`flex-1 text-[16px] font-medium py-3 px-6 transition-colors ${
          activeTab === 'default-settings'
            ? 'text-[#0F172A] bg-white'
            : 'text-[#64748B] bg-[#F1F5F9] hover:text-[#0F172A]'
        }`}
      >
        Default Settings
      </button>
    </div>
  );
} 