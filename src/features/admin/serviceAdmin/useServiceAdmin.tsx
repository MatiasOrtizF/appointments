import { useEffect, useState } from "react"
import { Service } from "../../../domain/models/Service"
import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { mapServiceErrorToMessage } from "../../../errors/serviceErrors"
import { getUserInfoUsecase } from "../../../domain/usecase/admin/getUserInfoUsecase"
import { authRepository } from "../../../data/repository/AuthRepository"
import { mapSignOutErrorToMessage } from "../../../errors/auth/signOutError"
import { deleteServiceUsecase } from "../../../domain/usecase/admin/deleteServiceUsecase"

export const useServiceAdmin = () => {
    const [services, setServices] = useState<Service[] | null>(null)
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
                    await fetchService()
                }
            } else {
                logOut()
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchService = async () => {
        try {
            const result = await serviceRepository.getServices()

            if (result.ok) {
                setServices(result.data)
            } else {
                setError(mapServiceErrorToMessage(result.error))
            }

        } finally {
            setLoading(false)
        }
    }

    const deleteService = async (serviceId: string) => {
        try {
            const result = await deleteServiceUsecase(serviceId)

            if (result.ok) {
                setServices(prev =>
                    prev?.filter(service => service.id !== serviceId) ?? null
                )
                setSuccess(true)
            } else {
                setError(mapServiceErrorToMessage(result.error))
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
        services,
        loading,
        success,
        error,
        refreshing,
        onRefresh,
        deleteService
    }
}