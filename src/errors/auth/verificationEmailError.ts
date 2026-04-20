 import { Result } from "../../shared/types/result"

export type VerificationEmailError =
  | "unauthenticated"
  | "user-disabled"
  | "too-many-requests"
  | "requires-recent-login"
  | "network"
  | "timeout"
  | "unknown"

export type VerificationEmailResult =
  Result<void, VerificationEmailError>

export const mapVerificationEmailErrorToMessage = (
  error: VerificationEmailError
): string => {
  switch (error) {
    case "unauthenticated":
      return "Tenés que iniciar sesión"

    case "user-disabled":
      return "La cuenta fue deshabilitada"

    case "too-many-requests":
      return "Demasiados intentos. Probá más tarde"

    case "requires-recent-login":
      return "Volvé a iniciar sesión para continuar"

    case "network":
      return "Sin conexión a internet"

    case "timeout":
      return "La solicitud tardó demasiado"

    default:
      return "No se pudo enviar el email de verificación"
  }
}