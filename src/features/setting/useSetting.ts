import { useEffect, useState } from "react";
import { authRepository } from "../../data/repository/AuthRepository";
import { settingRepository } from "../../data/repository/SettingRepository";
import { mapSignOutErrorToMessage } from "../../errors/auth/signOutError";

export const useSetting = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const logOut = async () => {
    console.log("llamamos al log out")
    setLoading(true);
    setError(null);

    try {
      const result = await authRepository.signOut()
      console.log("salio bien? " + result.ok)
      if (!result.ok) {
        setError(mapSignOutErrorToMessage(result.error))
      }

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