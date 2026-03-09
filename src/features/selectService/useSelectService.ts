import { useEffect, useState } from "react"
import { getServices } from "../../data/repository/serviceRepository"

export const useServices = () => {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchServices = async () => {
    setLoading(true)
    const data = await getServices()
    setServices(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return {
    services,
    loading,
    fetchServices
  }
}