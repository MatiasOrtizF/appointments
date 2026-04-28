import { Service } from "../domain/models/Service"
import { Result } from "../shared/types/result"


export type ServiceError =
  | "timeout"
  | "permission"
  | "network"
  | "unknown"

export type ServiceResult = Result<Service[], ServiceError>

export const mapServiceErrorToMessage = (error: ServiceError): string => {
  switch (error) {
    case "permission":
      return "No tenés permisos para ver los servicios"
    case "network":
      return "Sin conexión a internet"
    case "timeout":
      return "La solicitud tardó demasiado"
    default:
      return "Algo salio mal intentalo mas tarde"
  }
}