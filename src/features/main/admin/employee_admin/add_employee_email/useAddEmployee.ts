import { useState } from "react"
import { mapSignOutErrorToMessage } from "../../../../../errors/auth/signOutError"
import { authRepository } from "../../../../../data/repository/AuthRepository"
import { Role, } from "../../../../../domain/models/Service"
import { addRoleUsecase } from "../../../../../domain/usecase/admin/employee/addRoleUsecase"
import { mapUserErrorToMessage } from "../../../../../errors/userError"

export const useAddEmployee = () => {
    const [email, setEmail] = useState("")
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [addingRole, setAddingRole] = useState(false)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [errorForm, setErrorForm] = useState<string | null>(null);

    const addEmployee = async (email: string) => {
        setAddingRole(true)
        setError(null)

        if (selectedRole != null) {
            try {
                const result = await addRoleUsecase(email, selectedRole)
                if (result.ok) {
                    setSuccess(true)
                } else {
                    setError(mapUserErrorToMessage(result.error))
                }
            } finally {
                setAddingRole(false)
            }
        }
    }

    const logOut = async () => {
        console.log("llamamos al log out")
        setLoading(true);
        setError(null);

        try {
            const result = await authRepository.signOut()
            console.log("salio bien? " + result.ok)
            if (!result.ok) {
                setError(mapSignOutErrorToMessage(result.error))
            }

        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        const trimmedEmail = email.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            setErrorForm("por favor agrega un email valido")
            return false;
        }

        if (!selectedRole) {
            setErrorForm("por favor seleciona un rol")
            return false;
        }

        setErrorForm(null)
        return true;
    };

    return {
        email, setEmail,
        addingRole, setAddingRole,
        selectedRole, setSelectedRole,
        loading,
        success,
        error,
        errorForm,
        isFormValid,
        addEmployee
    }
}