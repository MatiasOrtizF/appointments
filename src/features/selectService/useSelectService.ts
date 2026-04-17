import { useEffect, useState } from "react"
import { Service } from "../../domain/models/Service"
import { serviceRepository } from "../../data/repository/ServiceRepository"
import { mapServiceErrorToMessage } from "../../errors/serviceErrors"

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchServices();

    setRefreshing(false);
  };


  const fetchServices = async () => {
    setLoading(true)
    setError(null)

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

  useEffect(() => {
    fetchServices()
  }, [])

  return {
    services,
    loading,
    error,
    refreshing,
    onRefresh
  }
}