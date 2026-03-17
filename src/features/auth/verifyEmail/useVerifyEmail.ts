import { useState } from "react";
import { authRepository } from "../../../data/repository/AuthRepository";

export const useVerifyEmail = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmailVerification = async () => {
    console.log("reenviar email")
    try {
    setLoading(true);
      setError(null);

      await authRepository.sendVerificationEmail()
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const verifyEmail = async () => {
    try {
      setLoading(true);
      setError(null);

      await authRepository.verifyEmailIsVerified()
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

    const logOut = async () => {

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
    sendEmailVerification,
    verifyEmail,
    logOut,
    loading,
    error
  };

};