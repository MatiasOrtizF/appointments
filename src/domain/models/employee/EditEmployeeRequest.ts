import { Day, EmployeeStatus, Role } from "../service/Service"

export interface EditEmployeeRequest {
    id: string
    name: string
    img: string,
    lastName: string
    role: Role
    status: EmployeeStatus
}