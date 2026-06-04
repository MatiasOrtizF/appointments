import { useEffect, useState } from "react"
import { Service } from "../../../../domain/models/Service"
import { serviceRepository } from "../../../../data/repository/ServiceRepository"
import { mapServiceErrorToMessage } from "../../../../errors/serviceErrors"
import { deleteServiceUsecase } from "../../../../domain/usecase/service/deleteServiceUsecase"

export const useServiceAdmin = () => {
    const [services, setServices] = useState<Service[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchService()
    }, [])

    const onRefresh = async () => {
        setRefreshing(true);

        await fetchService();

        setRefreshing(false);
    };

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

    const deleteService = async (serviceId: string, imageUrl: string) => {
        try {
            const result = await deleteServiceUsecase(serviceId, imageUrl)
            
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