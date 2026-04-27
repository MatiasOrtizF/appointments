import { useState } from "react"
import { CreateAppointmentInput } from "../../domain/models/CreateAppointmentInput"
import { Service } from "../../domain/models/Service"
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
  const [hoursNotAvailable, setHoursNotAvailable] = useState<string[]>([])
  const [daysNotAvailable, setDaysNotAvailable] = useState<number[]>()
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayString);
  const [selectedTime, setSelectedTime] = useState<Hour | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const fetchHourAvailable = async (serviceId: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await appointmentRepository.getHoursAvailable(serviceId, todayString)

      if (result.ok) {
        setHoursNotAvailable(result.data)
      } else {
        setError(mapAppointmentErrorToMessage(result.error))
      }
    } finally {
      fetchService(serviceId)
    }
  }

  const fetchService = async (serviceId: string) => {

    try {
      const result = await serviceRepository.getService(serviceId)

      if (result.ok) {

        setService(result.data)
        const hoursGenerated = generateHours(result.data.hourStart, result.data.hourEnd, result.data.duration_min, hoursNotAvailable)
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

  const createApointment = async (date: string, time: string | null, employeeImg: string | undefined, employeeName: string | undefined, employeeId: string | undefined) => {
    setLoading(true)
    setError(null)

    if (time != null && service != null && selectedTime != null) {
      const input: CreateAppointmentInput = {
        dateTime: date + "T" + time,
        date: selectedDate,
        employeeId: employeeId ? employeeId : "",
        employeeImg: employeeImg ? employeeImg : "",
        employeeName: employeeName ? employeeName : "",
        price: service.price,
        service: service.name,
        serviceId: service.id,
        serviceImg: service.img,
        time: selectedTime,
        status: "pending",
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