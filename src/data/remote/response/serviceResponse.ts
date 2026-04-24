import { DocumentReference } from "firebase/firestore"
import { Employee, Service } from "../../../domain/models/Service"

export interface ServiceResponse {
  name: string
  description: string
  price: number
  duration_min: number
  img: string,
  employees: DocumentReference[]
  days: string[]
  hourStart: string
  hourEnd: string
}

export const toDomain = (
  id: string,
  response: ServiceResponse,
  employees: Employee[]
): Service => {

  return {
    id,
    name: response.name,
    description: response.description,
    price: response.price,
    duration_min: response.duration_min,
    img: response.img,
    employees: employees,
    days: response.days,
    hourStart: response.hourStart,
    hourEnd: response.hourEnd
  }
}