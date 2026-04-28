import { AuthUser } from "../domain/models/AuthUser";
import { Result } from "../shared/types/result"


export type UserError =
  | "email-already-in-use"
  | "weak-password"
  | "invalid-email"
  | "timeout"
  | "permission"
  | "network"
  | "unauthenticated"
  | "not-found"
  | "unknown";

export type UserResult = Result<AuthUser, UserError>

export const mapUserErrorToMessage = (error: UserError): string => {
  switch (error) {

    case "email-already-in-use":
      return "Ese email ya está registrado"

    case "weak-password":
      return "La contraseña es demasiado débil"

    case "invalid-email":
      return "El email no es válido"

    case "timeout":
      return "La solicitud tardó demasiado"

    case "permission":
      return "No tenés permisos para ver los usuarios"

    case "network":
      return "Sin conexión a internet"

    case "unauthenticated":
      return "Tenés que iniciar sesión"

    case "not-found":
      return "Usuario no encontrado"

    default:
      return "Algo salio mal, intentalo mas tarde"
  }
}