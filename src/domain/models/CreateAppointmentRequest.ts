import { Timestamp } from "firebase/firestore";

export interface CreateAppointmentRequest {
    clientName: string,
    dateTime: Timestamp,
    employeeImg: string,
    employeeName: string,
    price: number,
    service: string,
    serviceImg: string,
    status: string,
    uid: string,
}