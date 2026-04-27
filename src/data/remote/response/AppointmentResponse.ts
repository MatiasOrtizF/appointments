import { Timestamp } from "firebase/firestore"
import { Appointment } from "../../../domain/models/Appointment"

export interface AppointmentResponse {
  dateTime: Timestamp,
  date: string,
  service: string
  uid: string
  serviceImg: string
  status: string,
  price: number,
  employeeName: string,
  time: string
}

export const toDomain = (
  id: string,
  response: AppointmentResponse
): Appointment => {
  const dateObj = response.dateTime.toDate()

  //const date = dateObj.toISOString().split("T")[0] // "YYYY-MM-DD"

  //const time = dateObj.toTimeString().slice(0, 5) // "HH:mm"

  return {
    id,
    date: response.date,
    service: response.service,
    time: response.time,
    uid: response.uid,
    serviceImg: response.serviceImg,
    status: response.status,
    price: response.price,
    employeeName: response.employeeName,
  }
}