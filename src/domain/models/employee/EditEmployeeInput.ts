import { EmployeeStatus } from "../service/Service"

export interface EditEmployeeInput {
    id: number
    name: string
    lastName: string
    status: EmployeeStatus
    newImage: string
    oldImageUrl: string
    imageChanged: boolean
}