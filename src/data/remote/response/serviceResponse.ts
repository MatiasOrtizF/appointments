import { Day, Employee, Service } from "../../../domain/models/Service"

export interface ServiceResponse {
  id: string,
  title: string
  description: string
  price: number
  duration_minutes: number
  image_url: string,
  available_days: Day[]

  start_time: string
  end_time: string

  employees: Employee[]
}

export const serviceToDomain = (
response: ServiceResponse
): Service => {

  return {
    id: response.id,
    name: response.title,

    description: response.description,

    price: response.price,

    duration_min: response.duration_minutes,

    img: response.image_url,

    employees: response.employees,

    days: response.available_days,

    hourStart: response.start_time,

    hourEnd: response.end_time
  }
}