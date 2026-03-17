import { useState } from "react";
import { authRepository } from "../../data/repository/AuthRepository";

export const useSetting = () => {
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

  return {
    logOut,
    loading,
    error
  };
};