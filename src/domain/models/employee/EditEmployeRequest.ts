import { EmployeeStatus } from "../Service"

export interface EditEmployeeInput {
    id: string
    name: string
    lastName: string
    status: EmployeeStatus
    newImg: string
}