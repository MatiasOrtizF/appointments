import { Hour } from "../../../utils/generateHours";

export interface CreateAppointmentInput {
    date: string,
    time: Hour,
    employeeId: string,
    serviceId: string,
}