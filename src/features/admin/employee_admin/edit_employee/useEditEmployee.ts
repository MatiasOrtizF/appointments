import { useEffect, useState } from "react"
import { getUserInfoUsecase } from "../../../../domain/usecase/admin/getUserInfoUsecase"
import { authRepository } from "../../../../data/repository/AuthRepository"
import { mapSignOutErrorToMessage } from "../../../../errors/auth/signOutError"

export const useEditEmployee = () => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getUserInfo()
    }, [])

    const onRefresh = async () => {
        setRefreshing(true);

        await getUserInfo();

        setRefreshing(false);
    };

    const getUserInfo = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await getUserInfoUsecase()

            if (result.ok) {
                const isAdmin = result.data.role === "admin"
                setIsAdmin(isAdmin)
                console.log("?" + isAdmin)
                if (isAdmin) {
                    
                }
            } else {
                logOut()
            }
        } finally {
            setLoading(false)
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

    return {
        loading,
        success,
        error,
        refreshing,
        onRefresh,
    }
}