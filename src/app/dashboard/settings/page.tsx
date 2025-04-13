'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSettings } from '@/hooks/useSettings';
import SettingsTabs from '@/components/features/settings/SettingsTabs';
import BusinessInfoForm from '@/components/features/settings/BusinessInfoForm';
import DefaultSettingsForm from '@/components/features/settings/DefaultSettingsForm';
import { BusinessInfo, DefaultSettings } from '@/types/settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'business-info' | 'default-settings'>('business-info');
  const { settings, isLoading, error, updateBusinessInfo, updateDefaultSettings } = useSettings();

  const handleBusinessInfoSubmit = async (data: BusinessInfo) => {
    try {
      await updateBusinessInfo.mutateAsync(data);
      toast.success('Business information updated successfully');
    } catch (error) {
      toast.error('Failed to update business information');
      console.error(error);
    }
  };

  const handleDefaultSettingsSubmit = async (data: DefaultSettings) => {
    try {
      await updateDefaultSettings.mutateAsync(data);
      toast.success('Default settings updated successfully');
    } catch (error) {
      toast.error('Failed to update default settings');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="animate-pulse bg-gray-200 h-[400px] rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <div className="bg-red-50 p-6 rounded-lg text-red-600">
          <p>Failed to load settings. Please try again later.</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  // Provide default values in case settings haven't been initialized yet
  const businessInfo = settings?.businessInfo || {
    businessName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  };

  const defaultSettings = settings?.defaultSettings || {
    defaultTaxRate: 0,
    estimateExpiry: 30,
    invoiceDue: 14,
    defaultTerms: 'Payment is due within 14 days of invoice date.',
    defaultNotes: 'Thank you for your business!',
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'business-info' ? (
        <BusinessInfoForm
          initialData={businessInfo}
          onSubmit={handleBusinessInfoSubmit}
          isSubmitting={updateBusinessInfo.isPending}
        />
      ) : (
        <DefaultSettingsForm
          initialData={defaultSettings}
          onSubmit={handleDefaultSettingsSubmit}
          isSubmitting={updateDefaultSettings.isPending}
        />
      )}
    </div>
  );
} 