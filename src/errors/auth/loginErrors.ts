import { User } from "firebase/auth"
import { Result } from "../../shared/types/result"

export type LoginError =
    | "invalid-credentials"
    | "user-not-found"
    | "wrong-password"
    | "invalid-email"
    | "user-disabled"
    | "too-many-requests"
    | "network"
    | "timeout"
    | "unknown"

export type LoginResult = Result<User, LoginError>

export const mapLoginErrorToMessage = (error: LoginError): string => {
    switch (error) {
        case "invalid-credentials":
            return "Email o contraseña incorrectos"

        case "user-not-found":
            return "Email o contraseña incorrectos"

        case "wrong-password":
            return "Email o contraseña incorrectos"

        case "invalid-email":
            return "El email no es válido"

        case "user-disabled":
            return "La cuenta fue deshabilitada"

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