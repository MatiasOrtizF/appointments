export type PasswordRecoveryError =
  | "user-not-found"
  | "invalid-email"
  | "too-many-requests"
  | "network"
  | "unknown"

export const mapPasswordRecoveryErrorToMessage = (
  error: PasswordRecoveryError
): string => {

  switch (error) {

    case "user-not-found":
      return "No existe una cuenta con ese email"

    case "invalid-email":
      return "El email no es válido"

    case "too-many-requests":
      return "Demasiados intentos. Probá más tarde"

    case "network":
      return "Sin conexión a internet"

    default:
      return "No se pudo enviar el email"
  }
}