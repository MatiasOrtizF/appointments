import { User } from "firebase/auth"
import { Result } from "../../shared/types/result"

export type RegisterError =
    | "email-already-in-use"
    | "weak-password"
    | "invalid-email"
    | "too-many-requests"
    | "network"
    | "timeout"
    | "unknown"

export type RegisterResult = Result<User, RegisterError>

export const mapRegisterErrorToMessage = (error: RegisterError): string => {
    switch (error) {

        case "email-already-in-use":
            return "Ese email ya está registrado"

        case "weak-password":
            return "La contraseña es demasiado débil"

        case "invalid-email":
            return "El email no es válido"

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