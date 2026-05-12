import { Employee, EmployeeStatus, Role } from "../../../domain/models/Service"

export interface EmployeeResponse {
  name: string
  lastName: string
  img: string
  role: Role
  status: EmployeeStatus
}

export const employeeToDomain = (
  id: string,
  response: EmployeeResponse
): Employee => {
  return {
    id,
    name: response.name,
    lastName: response.lastName,
    img: response.img,
    role: response.role,
    status: response.status
  }
}