import { useEffect, useState } from "react"
import { Appointment } from "../../domain/models/Appointment"
import { mapAppointmentErrorToMessage } from "../../errors/appointmentErrors"
import { getUpcomingAppointmentsUsecase } from "../../domain/usecase/appointments/getUpcomingAppointmentsUsecase"
import { getPastAppointmentsUsecase } from "../../domain/usecase/appointments/getPastAppointmentsUsecase"
import { appointmentRepository } from "../../data/repository/AppointmentRepository"

export const useBooking = () => {
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([])
  const [upcommingAppointments, setUpcommingAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const onRefresh = async (tab: string) => {
    setRefreshing(true);

    if (tab === "upcoming") {
      await fetchUpcomingAppointments()
    } else {
      await fetchPastAppointments()
    }

    setRefreshing(false);
  };

  const cancelAppointment = async (appointmentId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await appointmentRepository.cancelAppointment(appointmentId)

      if (result.ok) {
        setUpcommingAppointments(prev => {
          console.log("antes", prev)

          const filtered = prev?.filter(
            appointment => appointment.id !== appointmentId
          ) ?? null

          console.log("despues", filtered)

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

  const fetchUpcomingAppointments = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUpcomingAppointmentsUsecase()

      if (result.ok) {
        setUpcommingAppointments(result.data)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  const fetchPastAppointments = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getPastAppointmentsUsecase()

      if (result.ok) {
        setPastAppointments(result.data)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUpcomingAppointments()
    fetchPastAppointments()
  }, [])

  return {
    pastAppointments,
    upcommingAppointments,
    loading,
    error,
    success,
    cancelAppointment,
    refreshing,
    onRefresh
  }
}