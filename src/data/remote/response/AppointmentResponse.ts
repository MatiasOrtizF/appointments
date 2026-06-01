import { Appointment } from "../../../domain/models/Appointment"
import { Employee, Service } from "../../../domain/models/Service"

export interface AppointmentResponse {
  id: string,
  created_at: string,
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
    employee: response.employee,
    service: response.service,
    appointmentAt: response.appointment_at,
    status: response.status
  }
}