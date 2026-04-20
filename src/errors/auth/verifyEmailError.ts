import { Result } from "../../shared/types/result"

export type VerifyEmailError =
  | "unauthenticated"
  | "network"
  | "timeout"
  | "unknown"

export type VerifyEmailResult =
  Result<boolean, VerifyEmailError>

export const mapVerifyEmailErrorToMessage = (
  error: VerifyEmailError
): string => {
  switch (error) {
    case "unauthenticated":
      return "Tenés que iniciar sesión"

    case "network":
      return "Sin conexión a internet"

    case "timeout":
      return "La solicitud tardó demasiado"

    default:
      return "No se pudo verificar el email"
  }
}