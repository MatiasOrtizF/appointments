import { Appointment } from "../../../domain/models/appointments/Appointment"
import { AuthUser } from "../../../domain/models/auth/AuthUser";
import { Employee, Service } from "../../../domain/models/service/Service"

export interface AppointmentResponse {
  id: string,
  created_at: string,
  user: AuthUser
  employee: Employee,
  service: Service,
  appointment_at: string,
  status: AppointmentStatus
}

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export const appointmentToDomain = (
  response: AppointmentResponse
): Appointment => {

  return {
    id: response.id,
    createdAt: response.created_at,
    user: response.user,
    employee: response.employee,
    service: response.service,
    appointmentAt: response.appointment_at,
    status: response.status
  }
}