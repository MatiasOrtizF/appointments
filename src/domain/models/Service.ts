
export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_min: number
  img: string
  employees: Employee[]
  days: Day[]
  hourStart: string
  hourEnd: string
}

export interface Employee {
  id: string,
  name: string,
  lastName: string,
  img: string,
  role: Role,
  status: EmployeeStatus
}

export type Day =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

export type EmployeeStatus =
  | "active"
  | "vacation"
  | "sick"
  | "day_off"

export const roles = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  USER: "user"
} as const

export type Role = typeof roles[keyof typeof roles]