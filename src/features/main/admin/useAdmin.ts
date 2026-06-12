import { useEffect, useState } from "react"
import { Appointment } from "../../../domain/models/appointments/Appointment"
import { adminRepository } from "../../../data/repository/AdminRepository"
import { mapDatabaseErrorToMessage } from "../../../errors/databaseErrorMessages"

export const useAdmin = () => {
  const [upcommingAdminAppointments, setUpcommingAdminAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchUpcomingTodayAppointments();

    setRefreshing(false);
  };

  const fetchUpcomingTodayAppointments = async () => {
    setError(null)

    try {
      const result = await adminRepository.getUpcomingTodayAppointments()
      console.log(result)
      if (result.ok) {
        setUpcommingAdminAppointments(result.data)
      } else {
        setError(mapDatabaseErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcomingTodayAppointments()
  }, [])

  return {
    upcommingAdminAppointments,
    loading,
    error,
    refreshing,
    onRefresh
  }
}