import { useState } from "react";
import { authRepository } from "../../../data/repository/AuthRepository";
import { User } from "firebase/auth";

export const useLogin = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);

  const login = async () => {
    try {
      setLoading(true);
      setError(null);

    const user = await authRepository.login(email, password);
    setUser(user)

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
    user,
    loading,
    error
  };
};