import { useState } from "react";
import { authRepository } from "../../../data/repository/AuthRepository";

export const useRecoveryPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState(false);

    const recoveryPassword = async () => {
        if (!email.trim()) {
            setError("Por favor ingresa un email");
            return;
        }

        try {
            setLoading(true);
            setError(null);


            await authRepository.passwordRecovery(email)
            setSuccess(true)
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        success,
        recoveryPassword,
        loading,
        error
    };
};