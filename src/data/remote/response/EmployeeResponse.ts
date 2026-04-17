import { Employee } from "../../../domain/models/Service"

export interface EmployeeResponse {
  name: string
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
    img: response.img,
    active: response.active
  }
}