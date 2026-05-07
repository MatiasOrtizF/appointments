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
  active: boolean
}

export type Day = 
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";