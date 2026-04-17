import { useEffect, useState } from "react"
import { Appointment } from "../../domain/models/Appointment"
import { mapAppointmentErrorToMessage } from "../../errors/appointmentErrors"
import { getUserInfoUsecase } from "../../domain/usecase/admin/getUserInfoUsecase"
import { mapUserErrorToMessage } from "../../errors/userError"
import { getAdminAppointmentsUsecase } from "../../domain/usecase/admin/getAdminAppointmentsUsecase"

export const useAppointmentAdmin = () => {
  const [adminAppointments, setAdminAppointments] = useState<Appointment[] | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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
        if (isAdmin) {
          await fetchAdminAppointments()
        }
      } else {
        setError(mapUserErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  const fetchAdminAppointments = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAdminAppointmentsUsecase()

      if (result.ok) {
        setAdminAppointments(result.data)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (bookingId: string) => {
    console.log("cancelar: "+bookingId)
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return {
    adminAppointments,
    isAdmin,
    loading,
    error,
    refreshing,
    onRefresh,
    cancelAppointment
  }
}