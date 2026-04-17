import { useState } from "react"
import { CreateAppointmentInput } from "../../domain/models/CreateAppointmentInput"
import { addAppointmentUsecase } from "../../domain/usecase/appointments/addAppointmentUsecase"
import { mapAppointmentErrorToMessage } from "../../errors/appointmentErrors"

export const useScheduleAppointment = () => {
  const [success, setSuccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const fetchService = (serviceId: string)=> {
    console.log(serviceId)
  }

  const createApointment = async (input: CreateAppointmentInput) => {
    setLoading(true)
    setError(null)

        console.log(input)

    /*try {
      const result = await addAppointmentUsecase(input)

      if (result.ok) {
        setSuccess(true)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }*/
  }
  return {
    success,
    loading,
    error,
    fetchService,
    createApointment
  }
}