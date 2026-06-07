import { useState } from "react"
import { CreateAppointmentInput } from "../../domain/models/appointments/CreateAppointmentInput"
import { Service } from "../../domain/models/service/Service"
import { serviceRepository } from "../../data/repository/ServiceRepository"
import { mapServiceErrorToMessage } from "../../errors/serviceErrors"
import { generateHours, Hour } from "../../utils/generateHours"
import { getMissingDaysIndexes } from "../../utils/getMissingDaysIndexes"
import { addAppointmentUsecase } from "../../domain/usecase/appointments/addAppointmentUsecase"
import { mapAppointmentErrorToMessage } from "../../errors/appointmentErrors"
import { appointmentRepository } from "../../data/repository/AppointmentRepository"

export const useScheduleAppointment = () => {
  const [service, setService] = useState<Service>()
  const [hours, setHours] = useState<Hour[]>()
  const [daysNotAvailable, setDaysNotAvailable] = useState<number[]>()
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [selectedTime, setSelectedTime] = useState<Hour | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const fetchHourAvailable = async (serviceId: string, employeeId: string, selectedDay: string | null) => {
    setLoading(true)
    setError(null)
    try {
      const result = await appointmentRepository.getHoursAvailable(serviceId, employeeId, selectedDate)

      if (result.ok) {
        const hoursNotAvailable = result.data
        fetchService(serviceId, hoursNotAvailable, selectedDate)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }
    } finally {
    }
  }

  const fetchService = async (serviceId: string, hoursNotAvailable: string[], day: string) => {

    try {
      const result = await serviceRepository.getService(serviceId)
      if (result.ok) {

        setService(result.data)
        const hoursGenerated = generateHours(result.data.hourStart, result.data.hourEnd, result.data.duration_min, hoursNotAvailable, day)
        setHours(hoursGenerated)
        const missingDays = getMissingDaysIndexes(result.data.days)
        setDaysNotAvailable(missingDays)
      } else {
        setError(mapServiceErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  const createApointment = async (employeeId: string | undefined) => {
    setLoading(true)
    setError(null)

    if (service != null && selectedTime != null) {
      const input: CreateAppointmentInput = {
        date: selectedDate,
        employeeId: employeeId ? employeeId : "",
        serviceId: service.id,
        time: selectedTime
      }

      try {
        const result = await addAppointmentUsecase(input)

        if (result.ok) {
          setSuccess(true)
        } else {
          setError(mapAppointmentErrorToMessage(result.error))
        }

      } finally {
        setLoading(false)
      }
    } else {
      setError("elegir un horario")
    }
  }
  return {
    service,
    hours,
    daysNotAvailable,
    today,
    todayString,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    success,
    loading,
    error,
    fetchHourAvailable,
    fetchService,
    createApointment
  }
}