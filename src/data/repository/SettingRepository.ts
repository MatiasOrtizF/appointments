import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'theme';

export class SettingRepository {
  async getTheme(): Promise<'dark' | 'light'> {
    const value = await AsyncStorage.getItem(THEME_KEY);
    return value === 'dark' ? 'dark' : 'light';
  }

  async setTheme(theme: 'dark' | 'light'): Promise<void> {
    await AsyncStorage.setItem(THEME_KEY, theme);
  }
};

export const settingRepository = new SettingRepository();