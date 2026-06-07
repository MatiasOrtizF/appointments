import { Day } from "./Service"

export type CreateServiceInput = {
    name: string
    description: string
    price: number
    duration_min: number
    img: string // URI local
    employees: number[]
    days: Day[]
    hourStart: string
    hourEnd: string
}