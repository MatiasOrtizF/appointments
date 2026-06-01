import { AppointmentStatus } from "../../data/remote/response/AppointmentResponse";
import { Employee, Service } from "./Service";

export interface Appointment {
    id: string,
    createdAt: string,
    employee: Employee,
    service: Service,
    appointmentAt: string,
    status: AppointmentStatus
}