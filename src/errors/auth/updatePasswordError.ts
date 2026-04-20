import { Result } from "../../shared/types/result"

export type UpdatePasswordError =
  | "unauthenticated"
  | "invalid-credential"
  | "weak-password"
  | "requires-recent-login"
  | "network"
  | "timeout"
  | "unknown"

export type UpdatePasswordResult =
  Result<void, UpdatePasswordError>

export const mapUpdatePasswordErrorToMessage = (
  error: UpdatePasswordError
): string => {
  switch (error) {
    case "unauthenticated":
      return "Tenés que iniciar sesión"

    case "invalid-credential":
      return "La contraseña actual no es correcta"

    case "weak-password":
      return "La nueva contraseña es demasiado débil"

    case "requires-recent-login":
      return "Volvé a iniciar sesión para continuar"

    case "network":
      return "Sin conexión a internet"

    case "timeout":
      return "La solicitud tardó demasiado"

    default:
      return "No se pudo actualizar la contraseña"
  }
}