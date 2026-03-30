import { useState } from "react"
import { authRepository } from "../../../data/repository/AuthRepository";

export const useChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validations, setValidations] = useState<PasswordValidationResult | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    type PasswordValidationResult = {
        hasMinLength: boolean
        hasMaxLength: boolean
        hasUppercase: boolean
        hasLowercase: boolean
        hasNumber: boolean
        hasNoSpaces: boolean
        hasMatching: boolean
        isValid: boolean
    }

    const changePassword = async () => {
        const trimmedCurrentPassword = currentPassword.trim()
        const trimmedNewPassword = newPassword.trim()
        const trimmedConfirmPassword = confirmNewPassword.trim()
        const isNotEmpty = trimmedNewPassword.length > 0 && trimmedConfirmPassword.length > 0

        // 🔹 Validaciones
        const validations = {
            hasMinLength: trimmedNewPassword.length >= 8,
            hasMaxLength: trimmedNewPassword.length <= 30,
            hasUppercase: /[A-Z]/.test(trimmedNewPassword),
            hasLowercase: /[a-z]/.test(trimmedNewPassword),
            hasNumber: /[0-9]/.test(trimmedNewPassword),
            hasNoSpaces: !/\s/.test(trimmedNewPassword),
            hasMatching: isNotEmpty && trimmedNewPassword === trimmedConfirmPassword,
        }

        const isValid = Object.values(validations).every(Boolean)

        setValidations({ ...validations, isValid })

        // 🔹 Campos vacíos
        if (!trimmedCurrentPassword || !trimmedNewPassword || !trimmedConfirmPassword) {
            setError("Todos los campos son obligatorios")
            return
        }

        // 🔹 Validación general
        if (!isValid) {
            setError("Debes completar todos los requerimientos para actualizar tu contraseña")
            return
        }

        try {
            setLoading(true)
            setError(null)

            await authRepository.updatePassword(trimmedCurrentPassword, trimmedNewPassword)

            setSuccess(true)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return {
        currentPassword,
        newPassword,
        confirmNewPassword,
        validations,
        setCurrentPassword,
        setNewPassword,
        setConfirmNewPassword,
        changePassword,
        loading,
        error,
        success
    }
}