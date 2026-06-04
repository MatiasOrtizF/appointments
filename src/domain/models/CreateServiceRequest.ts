import { Day } from "./Service"

export interface CreateServiceRequest {
  name: string
  description: string
  price: number
  duration_min: number
  imgUrl: string
  employees: number[]
  days: Day[]
  hourStart: string
  hourEnd: string
}