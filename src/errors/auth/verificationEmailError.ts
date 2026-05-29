 export type VerificationEmailError =
  | "unauthenticated"
  | "too-many-requests"
  | "network"
  | "timeout"
  | "unknown"

export const mapVerificationEmailErrorToMessage = (
  error: VerificationEmailError
): string => {

  switch (error) {

    case "unauthenticated":
      return "Debes iniciar sesión"

    case "too-many-requests":
      return "Demasiados intentos. Probá más tarde"

    case "network":
      return "Sin conexión a internet"

    case "timeout":
      return "La solicitud tardó demasiado"

    default:
      return "No se pudo enviar el email"
  }
}