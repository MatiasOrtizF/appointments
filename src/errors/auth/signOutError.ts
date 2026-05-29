export type SignOutError =
  | "timeout"
  | "unknown"

export const mapSignOutErrorToMessage = (
  error: SignOutError
): string => {

  switch (error) {

    case "timeout":
      return "La solicitud tardó demasiado"

    default:
      return "No se pudo cerrar sesión"
  }
}