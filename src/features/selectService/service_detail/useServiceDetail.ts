import { useState } from "react"
import { Service } from "../../../domain/models/Service";
import { serviceRepository } from "../../../data/repository/ServiceRepository";
import { mapServiceErrorToMessage } from "../../../errors/serviceErrors";

export const useServiceDetail = () => {
  const [service, setService] = useState<Service>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const getService = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await serviceRepository.getService(id)

      if (result.ok) {
        setService(result.data)
      } else {
        setError(mapServiceErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  return {
    service,
    loading,
    error,
    getService
  }
}