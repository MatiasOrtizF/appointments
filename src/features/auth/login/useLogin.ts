import { useState } from "react";
import { authRepository } from "../../../data/repository/AuthRepository";
import { mapLoginErrorToMessage } from "../../../errors/auth/loginErrors";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    setLoading(true);
    setError(null);

    console.log("apretado")


    if (!email.trim()) {
      setError("Por favor ingresa un email");
      return;
    }

    try {
      const result = await authRepository.login(email, password)

      if (!result.ok) {
        setError(mapLoginErrorToMessage(result.error))
      }

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