import { useEffect, useState } from "react";
import { authRepository } from "../../data/repository/AuthRepository";
import { settingRepository } from "../../data/repository/SettingRepository";

export const useSetting = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logOut = async () => {
    console.log("deslogeandose")
    try {
      setLoading(true);
      setError(null);

      await authRepository.signOut()
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);

    try {
      await settingRepository.setTheme(newValue ? 'dark' : 'light');
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    //loadTheme();
  }, []);

  return {
    isDarkMode,
    toggleTheme,
    logOut,
    loading,
    error
  };
};