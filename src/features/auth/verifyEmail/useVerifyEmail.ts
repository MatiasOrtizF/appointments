import { useState } from "react";
import { authRepository } from "../../../data/repository/AuthRepository";
import { mapVerifyEmailErrorToMessage } from "../../../errors/auth/VerifyEmailError";
import { mapSignOutErrorToMessage } from "../../../errors/auth/signOutError";
import { mapVerificationEmailErrorToMessage } from "../../../errors/auth/verificationEmailError";

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmailVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authRepository.sendVerificationEmail()

      if (!result.ok) {
        setError(mapVerificationEmailErrorToMessage(result.error))
      }
    } finally {
      setLoading(false);
    }
  }

  const verifyEmail = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authRepository.verifyEmailIsVerified()

      if (!result.ok) {
        setError(mapVerifyEmailErrorToMessage(result.error))
      }

    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authRepository.signOut()

      if (!result.ok) {
        setError(mapSignOutErrorToMessage(result.error))
      }

    } finally {
      setLoading(false);
    }
  };


  return {
    sendEmailVerification,
    verifyEmail,
    logOut,
    loading,
    error
  };

};