import { Employee, EmployeeStatus, Role } from "../../../domain/models/Service"

export interface EmployeeResponse {
  id: number,
  name: string
  last_name: string
  image_url: string
  role: Role
  status: EmployeeStatus
}

export const employeeToDomain = (
  response: EmployeeResponse
): Employee => {
  return {
    id: response.id,
    name: response.name,
    lastName: response.last_name,
    img: response.image_url,
    role: response.role,
    status: response.status
  }
}