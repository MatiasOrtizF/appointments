export type LoginError =
  | "invalid-credentials"
  | "invalid-email"
  | "email-not-confirmed"
  | "too-many-requests"
  | "network"
  | "timeout"
  | "unknown"

export const mapLoginErrorToMessage = (
  error: LoginError
): string => {

  switch (error) {

    case "invalid-credentials":
      return "Email o contraseña incorrectos"

    case "invalid-email":
      return "El email no es válido"

    case "email-not-confirmed":
      return "Debes verificar tu email"

    case "too-many-requests":
      return "Demasiados intentos. Probá más tarde"

    case "network":
      return "Sin conexión a internet"

    case "timeout":
      return "La solicitud tardó demasiado"

    default:
      return "No se pudo iniciar sesión"
  }
}