import { appointmentRepository } from "../../../data/repository/AppointmentRepository"
import { authRepository } from "../../../data/repository/AuthRepository"
import { AppointmentError } from "../../../errors/appointmentErrors"
import { Result } from "../../../shared/types/result"
import { Appointment } from "../../models/Appointment"

export const getPastAppointmentsUsecase = async (
): Promise<Result<Appointment[], AppointmentError>> => {

  const user = await authRepository.getCurrentUser()

  if (!user) {
    return { ok: false, error: "unauthenticated" }
  }

  return appointmentRepository.getPastAppointments(user.uid)
}