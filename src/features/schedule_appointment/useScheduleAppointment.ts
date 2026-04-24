import { useState } from "react"
import { CreateAppointmentInput } from "../../domain/models/CreateAppointmentInput"
import { Service } from "../../domain/models/Service"
import { serviceRepository } from "../../data/repository/ServiceRepository"
import { mapServiceErrorToMessage } from "../../errors/serviceErrors"
import { generateHours, Hour } from "../../utils/generateHours"
import { getMissingDaysIndexes } from "../../utils/getMissingDaysIndexes"

export const useScheduleAppointment = () => {
  const [service, setService] = useState<Service>()
  const [hours, setHours] = useState<Hour[]>()
  const [daysNotAvailable, setDaysNotAvailable] = useState<number[]>()
  const [success, setSuccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const fetchService = async (serviceId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await serviceRepository.getService(serviceId)

      if (result.ok) {

        setService(result.data)
        const hoursGenerated = generateHours(result.data.hourStart, result.data.hourEnd, result.data.duration_min)
        setHours(hoursGenerated)
        const missingDays = getMissingDaysIndexes(result.data.days)
        setDaysNotAvailable(missingDays)
        console.log("missing days: "+ result.data.days)
      } else {
        setError(mapServiceErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
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
    service,
    hours,
    daysNotAvailable,
    success,
    loading,
    error,
    fetchService,
    createApointment
  }
}