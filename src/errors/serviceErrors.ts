import { Service } from "../domain/models/Service"
import { Result } from "../shared/types/result"


export type ServiceError =
  | "timeout"
  | "permission"
  | "network"
  | "not-found"
  | "unknown"

export type ServiceResult = Result<Service[], ServiceError>

export const mapServiceErrorToMessage = (error: ServiceError): string => {
  switch (error) {
    case "timeout":
      return "La solicitud tardó demasiado"
    case "permission":
      return "No tenés permisos para ver los servicios"
    case "network":
      return "Sin conexión a internet"
    case "not-found":
      return "Turno no encontrado"
    default:
      return "Algo salio mal intentalo mas tarde"
  }
}