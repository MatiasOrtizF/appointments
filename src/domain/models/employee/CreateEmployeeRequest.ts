import { EmployeeStatus } from "../service/Service"

export type CreateEmployeeRequest = {
    imageUrl: string
    name: string,
    lastName: string,
    status: EmployeeStatus
}