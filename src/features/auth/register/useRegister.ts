import { useState } from "react";
import { authRepository } from "../../../data/repository/AuthRepository";
import { mapRegisterErrorToMessage } from "../../../errors/auth/registerError";

export const useRegister = () => {

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    setLoading(true);
    setError(null);

    const trimmedFullName = fullName.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!trimmedFullName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setError("Todos los campos son obligatorios")
      setLoading(false);
      return
    }


    // 2️⃣ Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(trimmedEmail)) {
      setError("El email no es válido")
      setLoading(false);
      return
    }

    if (trimmedPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false);
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError("Las contraseñas deben coincidir")
      setLoading(false);
      return
    }

    try {

      const result = await authRepository.signUp(email, password)

      if (!result.ok) {
        setError(mapRegisterErrorToMessage(result.error))
      }

    } finally {
      setLoading(false);
    }
  };

  return {
    fullName,
    email,
    password,
    confirmPassword,
    setFullName,
    setEmail,
    setPassword,
    setConfirmPassword,
    register,
    loading,
    error
  };

};