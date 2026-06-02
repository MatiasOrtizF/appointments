import { AppointmentStatus } from "../../data/remote/response/AppointmentResponse";
import { AuthUser } from "../../domain/models/AuthUser";
import { Employee, Service } from "./Service";

export interface Appointment {
    id: string,
    createdAt: string,
    user: AuthUser,
    employee: Employee,
    service: Service,
    appointmentAt: string,
    status: AppointmentStatus
}