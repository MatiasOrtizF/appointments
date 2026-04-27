import { Hour } from "../../utils/generateHours";

export interface CreateAppointmentInput {
    dateTime: string,
    date: string,
    employeeId: string,
    employeeImg: string,
    employeeName: string,
    price: number,
    service: string,
    serviceId: string,
    serviceImg: string,
    status: string,
    time: Hour
}