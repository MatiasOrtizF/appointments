import { useState } from "react"
import { CreateAppointmentInput } from "../../domain/models/appointments/CreateAppointmentInput"
import { Service } from "../../domain/models/service/Service"
import { serviceRepository } from "../../data/repository/ServiceRepository"
import { generateHours, Hour } from "../../utils/generateHours"
import { getMissingDaysIndexes } from "../../utils/getMissingDaysIndexes"
import { addAppointmentUsecase } from "../../domain/usecase/appointments/addAppointmentUsecase"
import { appointmentRepository } from "../../data/repository/AppointmentRepository"
import { mapDatabaseErrorToMessage } from "../../errors/databaseErrorMessages"
import { authRepository } from "../../data/repository/AuthRepository"
import { mapSignOutErrorToMessage } from "../../errors/auth/signOutError"

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
        setError(mapDatabaseErrorToMessage(result.error))
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
        setError(mapDatabaseErrorToMessage(result.error))
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
          switch (result.error) {
            case "slot_taken":
              setError("Ese horario ya fue reservado");
              break;

            case "unauthenticated":
              logOut();
              break;

              default: 
              setError(mapDatabaseErrorToMessage(result.error))
              break;
          }
        }

      } finally {
        setLoading(false)
      }
    } else {
      setError("elegir un horario")
    }
  }

  const logOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authRepository.signOut()
      console.log("salio bien? " + result.ok)
      if (!result.ok) {
        setError(mapSignOutErrorToMessage(result.error))
      }

    } finally {
      setLoading(false);
    }
  };

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