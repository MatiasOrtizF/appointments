import { Result } from "../../shared/types/result"

export type SignOutError =
  | "timeout"
  | "unknown"

export type SignOutResult = Result<void, SignOutError>

export const mapSignOutErrorToMessage = (error: SignOutError): string => {
    switch (error) {
        case "timeout":
            return "La solicitud tardó demasiado"

        default:
            return "No se pudo iniciar sesión"
    }
}