import { appointmentRepository } from "../../../data/repository/AppointmentRepository"
import { authRepository } from "../../../data/repository/AuthRepository"
import { DatabaseError } from "../../../errors/databaseError"
import { Result } from "../../../shared/types/result"
import { Appointment } from "../../models/appointments/Appointment"

export const getUpcomingAppointmentsUsecase = async (
): Promise<Result<Appointment[], DatabaseError>> => {

  const user = await authRepository.getCurrentUser()

  if (!user) {
    return { ok: false, error: "unauthenticated" }
  }

  return appointmentRepository.getUpcomingAppointments(user.id)
}