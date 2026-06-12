import { useState } from "react"
import { Employee, Service } from "../../../../domain/models/service/Service";
import { serviceRepository } from "../../../../data/repository/ServiceRepository";
import { mapDatabaseErrorToMessage } from "../../../../errors/databaseErrorMessages";

export const useServiceDetail = () => {
  const [service, setService] = useState<Service>();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getService = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await serviceRepository.getService(id)

      if (result.ok) {
        console.log("empleados???", result.data)
        setService(result.data)
      } else {
        setError(mapDatabaseErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  return {
    service,
    selectedEmployee,
    setSelectedEmployee,
    loading,
    error,
    getService
  }
}