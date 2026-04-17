import { adminRepository } from "../../../data/repository/AdminRepository"
import { authRepository } from "../../../data/repository/AuthRepository"
import { userRepository } from "../../../data/repository/UserRepository"
import { AppointmentError } from "../../../errors/appointmentErrors"
import { Result } from "../../../shared/types/result"
import { Appointment } from "../../models/Appointment"

export const getUpcomingAdminAppointmentsUsecase = async (
): Promise<Result<Appointment[], AppointmentError>> => {

  const currentUser = await authRepository.getCurrentUser()

  if(!currentUser) {
    return { ok: false, error: "unauthenticated" };
  }

  const userResult = await userRepository.getUser(currentUser.uid);

  if (!userResult.ok) {
    return { ok: false, error: "unauthenticated" };
  }

  if (userResult.data.role !== "admin") {
    return { ok: false, error: "unauthenticated" };
  }

  return adminRepository.getUpcomingAdminAppointments(currentUser.uid);
}