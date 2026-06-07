import { useState } from "react";
import { mapRegisterErrorToMessage } from "../../../errors/auth/registerError";
import { SignUpRequest } from "../../../domain/models/auth/SignUpRequest";
import { authRepository } from "../../../data/repository/AuthRepository";

export const useRegister = () => {

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async () => {
    setLoading(true);
    setError(null);

    const trimmedName = name.trim()
    const trimmedLastName = lastName.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!trimmedName || !trimmedLastName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
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

    const input: SignUpRequest = {
      email: email,
      password: password,
      name: name,
      lastName: lastName,
    }

    try {

      const result = await authRepository.signUp(input)

      if (result.ok) {
        setSuccess(true)
      } else {
        setError(mapRegisterErrorToMessage(result.error))
      }

    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    lastName,
    email,
    password,
    confirmPassword,
    setName,
    setLastName,
    setEmail,
    setPassword,
    setConfirmPassword,
    register,
    loading,
    error,
    success
  };

};