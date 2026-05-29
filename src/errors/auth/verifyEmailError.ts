export type VerifyEmailError =
  | "unauthenticated"
  | "not-verified"
  | "network"
  | "timeout"
  | "unknown"

export const mapVerifyEmailErrorToMessage = (
  error: VerifyEmailError
): string => {

  switch (error) {

    case "unauthenticated":
      return "Debes iniciar sesión"

    case "not-verified":
      return "Tu email aún no fue verificado"

    case "network":
      return "Sin conexión a internet"

    case "timeout":
      return "La solicitud tardó demasiado"

    default:
      return "No se pudo verificar el email"
  }
}