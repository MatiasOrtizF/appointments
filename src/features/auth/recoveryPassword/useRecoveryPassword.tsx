import { useState } from "react";
import { authRepository } from "../../../data/repository/AuthRepository";
import { mapPasswordRecoveryErrorToMessage } from "../../../errors/auth/passwordRecoveryError";

export const useRecoveryPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const recoveryPassword = async () => {
        setLoading(true);
        setError(null);

        if (!email.trim()) {
            setError("Por favor ingresa un email");
            return;
        }

        try {
            const result = await authRepository.passwordRecovery(email)

            if (result.ok) {
                setSuccess(result.ok)
            } else {
                setError(mapPasswordRecoveryErrorToMessage(result.error))
            }

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