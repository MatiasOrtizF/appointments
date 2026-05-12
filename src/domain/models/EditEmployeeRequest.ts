import { Day, EmployeeStatus, Role } from "./Service"

export interface EditEmployeeRequest {
    id: string
    name: string
    img: string,
    lastName: string
    role: Role
    status: EmployeeStatus
}