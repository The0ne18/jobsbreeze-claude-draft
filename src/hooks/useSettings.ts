'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';
import { BusinessInfo, DefaultSettings } from '@/types/settings';

export function useSettings() {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
  });

  const updateBusinessInfo = useMutation({
    mutationFn: (businessInfo: BusinessInfo) => settingsService.updateBusinessInfo(businessInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const updateDefaultSettings = useMutation({
    mutationFn: (defaultSettings: DefaultSettings) => settingsService.updateDefaultSettings(defaultSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateBusinessInfo,
    updateDefaultSettings,
  };
} 