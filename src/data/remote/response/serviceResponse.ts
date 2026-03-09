import { Service } from "../../../domain/models/Service"

export interface ServiceResponse {
  name: string
  description: string
  price: number
  duration_min: number
  img: string
}

export const toDomain = (
  id: string,
  response: ServiceResponse
): Service => {
  return {
    id,
    name: response.name,
    description: response.description,
    price: response.price,
    duration_min: response.duration_min,
    img: response.img
  }
}