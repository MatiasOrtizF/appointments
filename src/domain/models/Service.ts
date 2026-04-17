export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration_min: number
  img: string
  employees: Employee[]
}

export interface Employee {
  id: string,
  name: string,
  img: string,
  active: boolean
}