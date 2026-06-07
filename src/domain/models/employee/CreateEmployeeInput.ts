import { EmployeeStatus } from "../service/Service"

export type CreateEmployeeInput = {
    image: string //URI local
    name: string,
    lastName: string,
    status: EmployeeStatus
}