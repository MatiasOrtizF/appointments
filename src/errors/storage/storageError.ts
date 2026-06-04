import { Result } from "../../shared/types/result"

export type StorageError =
    | "timeout"
    | "permission"
    | "network"
    | "unauthenticated"
    | "slot_taken"
    | "not-found"
    | "unknown"

export type StorageResult = Result<string, StorageError>

export const mapAppointmentErrorToMessage = (error: StorageError): string => {
    switch (error) {
        case "timeout":
            return "La solicitud tardó demasiado"
        case "permission":
            return "No tenés permisos para realizar esta accion"
        case "network":
            return "Sin conexión a internet"
        case "unauthenticated":
            return "Tenés que iniciar sesión"
        case "slot_taken":
            return "Ese horario ya fue reservado. Por favor, seleccioná otro turno."
        case "not-found":
            return "Turno no encontrado"
        default:
            return "Algo salio mal, intentalo mas tarde"
    }
}