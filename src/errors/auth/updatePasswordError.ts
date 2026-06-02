export type UpdatePasswordError =
  | "invalid_credentials"
  | "weak_password"
  | "same_password"
  | "unauthorized"
  | "unknown";

export const mapUpdatePasswordErrorToMessage = (
  error: UpdatePasswordError
): string => {

  switch (error) {
    case "invalid_credentials":
      return "La contraseña actual es incorrecta";

    case "weak_password":
      return "La nueva contraseña es demasiado débil";

    case "same_password":
      return "La nueva contraseña debe ser diferente a la actual";

    case "unauthorized":
      return "Tu sesión expiró. Iniciá sesión nuevamente";

    default:
      return "Ocurrió un error inesperado";
  }
}