import { useEffect, useState } from "react"
import { Appointment } from "../../../../domain/models/Appointment"
import { mapAppointmentErrorToMessage } from "../../../../errors/appointmentErrors"
import { adminRepository } from "../../../../data/repository/AdminRepository"
import { appointmentRepository } from "../../../../data/repository/AppointmentRepository"

export const useAppointmentAdmin = () => {
  const [adminAppointments, setAdminAppointments] = useState<Appointment[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    fetchAdminAppointments()
    setRefreshing(false);
  };

  const fetchAdminAppointments = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await adminRepository.getAdminAppointments()

      if (result.ok) {
        setAdminAppointments(result.data)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await appointmentRepository.cancelAppointment(appointmentId)

      if (result.ok) {
        setAdminAppointments(prev => {

          const filtered = prev?.filter(
            appointment => appointment.id !== appointmentId
          ) ?? null

          return filtered
        })
        setSuccess(true)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminAppointments()
  }, [])

  return {
    adminAppointments,
    loading,
    error,
    success,
    refreshing,
    onRefresh,
    cancelAppointment
  }
}