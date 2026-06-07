import { AppointmentStatus } from "../../../data/remote/response/AppointmentResponse";
import { AuthUser } from "../auth/AuthUser";
import { Employee, Service } from "../service/Service";

export interface Appointment {
    id: string,
    createdAt: string,
    user: AuthUser,
    employee: Employee,
    service: Service,
    appointmentAt: string,
    status: AppointmentStatus
}