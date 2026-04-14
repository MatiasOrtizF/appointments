import { AuthUser } from "../domain/models/AuthUser";
import { Result } from "../shared/types/result"


export type UserError =
  | "not-found"
  | "network"
  | "permission"
  | "unknown";

export type UserResult = Result<AuthUser, UserError>

export const mapUserErrorToMessage = (error: UserError): string => {
  switch (error) {
    case "permission":
      return "No tenés permisos para ver los servicios"
    case "network":
      return "Sin conexión a internet"
    case "not-found":
      return "Usuario no encontrado"
    default:
      return "Error al cargar el usuario"
  }
}