import { useEffect, useState } from "react"
import { Service } from "../../../domain/models/service/Service"
import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { mapDatabaseErrorToMessage } from "../../../errors/databaseErrorMessages"

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
        setError(mapDatabaseErrorToMessage(result.error))
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