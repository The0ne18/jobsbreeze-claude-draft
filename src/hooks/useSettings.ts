'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { BusinessInfo, DefaultSettings } from '@/types/settings';
import { useEffect } from 'react';

// Default values to use as fallbacks if the API fails
const DEFAULT_BUSINESS_INFO: BusinessInfo = {
  businessName: '',
  email: '',
  phone: '',
  address: '',
  website: '',
  taxRate: 0,
  invoiceDueDays: 14,
};

const DEFAULT_SETTINGS = {
  businessInfo: DEFAULT_BUSINESS_INFO,
  defaultSettings: {
    defaultTaxRate: 0,
    estimateExpiry: 30,
    invoiceDue: 14,
    defaultTerms: 'Payment is due within 14 days of invoice date.',
    defaultNotes: 'Thank you for your business!'
  }
};

export function useSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
    refetch,
    isError,
    failureReason
  } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const data = await settingsService.getSettings();
        return data;
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Always return some data to avoid UI errors
        return DEFAULT_SETTINGS;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
  });

  // Log error details to help with debugging
  useEffect(() => {
    if (isError && failureReason) {
      console.error('Settings error details:', failureReason);
      
      // Check auth status if we have an error
      fetch('/api/settings/debug')
        .then(res => res.json())
        .then(data => {
          console.log('Auth debug info:', data);
        })
        .catch(err => {
          console.error('Failed to get debug info:', err);
        });
    }
  }, [isError, failureReason]);

  const updateBusinessInfo = useMutation({
    mutationFn: async (businessInfo: BusinessInfo) => {
      try {
        return await settingsService.updateBusinessInfo(businessInfo);
      } catch (error) {
        console.error('Failed to update business info:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const updateDefaultSettings = useMutation({
    mutationFn: async (defaultSettings: DefaultSettings) => {
      try {
        return await settingsService.updateDefaultSettings(defaultSettings);
      } catch (error) {
        console.error('Failed to update default settings:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    // Always return some data even if there's an error
    settings: settings || DEFAULT_SETTINGS,
    isLoading,
    error,
    updateBusinessInfo,
    updateDefaultSettings,
    refetch,
  };
} 