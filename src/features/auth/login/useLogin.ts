import { useState } from "react";
import { authRepository } from "../../../data/repository/AuthRepository";

export const useLogin = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);

  const login = async () => {
    try {
      setLoading(true);
      setError(null);

    await authRepository.login(email, password);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    login,
    loading,
    error
  };
};