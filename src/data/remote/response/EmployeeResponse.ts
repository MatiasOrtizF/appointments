import { Employee } from "../../../domain/models/Service"

export interface EmployeeResponse {
  name: string
  lastName: string
  img: string
  active: boolean
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
    active: response.active
  }
}