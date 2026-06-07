import { Day } from "./Service"

export interface EditServiceInput {
    id: string
    name: string
    description: string
    price: number
    duration: number
    employees: number[]
    days: Day[]
    hourStart: string
    hourEnd: string
    newImage: string
    oldImageUrl: string
    imageChanged: boolean
}