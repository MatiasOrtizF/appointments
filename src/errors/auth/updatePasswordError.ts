export type UpdatePasswordError =
  | "weak-password"
  | "same-password"
  | "requires-recent-login"
  | "network"
  | "timeout"
  | "unknown"

export const mapUpdatePasswordErrorToMessage = (
  error: UpdatePasswordError
): string => {

  switch (error) {

    case "weak-password":
      return "La contraseña es demasiado débil"

    case "same-password":
      return "La nueva contraseña debe ser diferente"

    case "requires-recent-login":
      return "Debes volver a iniciar sesión"

    case "network":
      return "Sin conexión a internet"

    case "timeout":
      return "La solicitud tardó demasiado"

    default:
      return "No se pudo actualizar la contraseña"
  }
}