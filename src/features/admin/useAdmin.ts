import { useEffect, useState } from "react"
import { Appointment } from "../../domain/models/Appointment"
import { getUpcomingAdminAppointmentsUsecase } from "../../domain/usecase/admin/getUpcomingAdminAppointmentsUsecase"
import { mapAppointmentErrorToMessage } from "../../errors/appointmentErrors"
import { getUserInfoUsecase } from "../../domain/usecase/admin/getUserInfoUsecase"
import { mapUserErrorToMessage } from "../../errors/userError"

export const useAdmin = () => {
  const [upcommingAdminAppointments, setUpcommingAdminAppointments] = useState<Appointment[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  const getUserInfo = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUserInfoUsecase()

      if (result.ok) {
        const isAdmin = result.data.role === "admin"
        setIsAdmin(isAdmin)
        if(isAdmin) {
          await fetchUpcomingAdminAppointments()
        }
      } else {
        setError(mapUserErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  const fetchUpcomingAdminAppointments = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUpcomingAdminAppointmentsUsecase()

      if (result.ok) {
        setUpcommingAdminAppointments(result.data)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserInfo()
    //fetchUpcomingAdminAppointments()
  }, [])

  return {
    upcommingAdminAppointments,
    isAdmin,
    loading,
    error
  }
}