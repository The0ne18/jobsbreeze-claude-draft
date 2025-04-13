import { apiClient } from '@/lib/api/client';
import { BusinessInfo, DefaultSettings, Settings } from '@/types/settings';

class SettingsService {
  async getSettings(): Promise<Settings> {
    const response = await apiClient.get<Settings>('/settings');
    return response.data;
  }

  async updateBusinessInfo(businessInfo: BusinessInfo): Promise<Settings> {
    const response = await apiClient.put<Settings>('/settings/business-info', businessInfo);
    return response.data;
  }

  async updateDefaultSettings(defaultSettings: DefaultSettings): Promise<Settings> {
    const response = await apiClient.put<Settings>('/settings/default-settings', defaultSettings);
    return response.data;
  }
}

export const settingsService = new SettingsService(); 