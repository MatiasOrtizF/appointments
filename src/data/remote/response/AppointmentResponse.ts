import { Appointment } from "../../../domain/models/Appointment"

export interface AppointmentResponse {
    date: string
    service: string
    time: string
    uid: string
    serviceImg: string
    status: string,
    price: number,
    employeeName: string
}

export const toDomain = (
  id: string,
  response: AppointmentResponse
): Appointment => {
  return {
    id,
    date: response.date,
    service: response.service,
    time: response.time,
    uid: response.uid,
    serviceImg: response.serviceImg,
    status: response.status,
    price: response.price,
    employeeName: response.employeeName
}
}