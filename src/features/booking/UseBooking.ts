import { useEffect, useState } from "react"
import { getUserAppointments } from "../../data/repository/appointmentRepository"
import { Appointment } from "../../domain/models/Appointment"

export const useBooking = () => {
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([])
  const [upcommingAppointments, setUpcommingAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUserAppointments = async () => {
    setLoading(true)
    const data = await getUserAppointments("TvKF3YzLImSGlC4QHuesD6pH5dp1")
    setPastAppointments(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUserAppointments()
  }, [])

  return {
    pastAppointments,
    upcommingAppointments,
    loading,
    fetchUserAppointments
  }
}