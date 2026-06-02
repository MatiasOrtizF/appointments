import { Day } from "./Service"

export interface EditServiceRequest {
    id: string
    name: string
    description: string
    price: number
    duration_min: number
    img: string,
    employees: number[]
    days: Day[]
    hourStart: string
    hourEnd: string
}