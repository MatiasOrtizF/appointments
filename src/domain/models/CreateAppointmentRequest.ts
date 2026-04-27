import { Timestamp } from "firebase/firestore";
import { Hour } from "../../utils/generateHours";

export interface CreateAppointmentRequest {
    dateTime: Timestamp,
    date: string,
    employeeId: string,
    employeeImg: string,
    employeeName: string,
    price: number,
    service: string,
    serviceId: string,
    serviceImg: string,
    status: string,
    time: Hour,
    uid: string,
}