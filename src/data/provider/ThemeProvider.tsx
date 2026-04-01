import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingRepository } from '../repository/SettingRepository';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: any) => {

  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  // 🔥 cargar tema
  useEffect(() => {
    const loadTheme = async () => {
      const theme = await settingRepository.getTheme();
      setIsDarkMode(theme === 'dark');
    };

    loadTheme();
  }, []);

  // 🔥 cambiar tema
  const toggleTheme = async () => {
    const newValue = !isDarkMode;

    setIsDarkMode(newValue);

    await settingRepository.setTheme(newValue ? 'dark' : 'light');
  };

  if (isDarkMode === null) return null;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};