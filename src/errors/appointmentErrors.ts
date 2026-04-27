import { Service } from "../domain/models/Service"
import { Result } from "../shared/types/result"


export type AppointmentError =
    | "timeout"
    | "permission"
    | "network"
    | "unauthenticated"
    | "slot_taken"
    | "unknown"

export type AppointmentResult = Result<Service[], AppointmentError>

export const mapAppointmentErrorToMessage = (error: AppointmentError): string => {
    switch (error) {
        case "permission":
            return "No tenés permisos para ver los servicios"
        case "network":
            return "Sin conexión a internet"
        case "timeout":
            return "La solicitud tardó demasiado"
        case "unauthenticated":
            return "Tenés que iniciar sesión"
        case "slot_taken":
            return "Ese horario ya fue reservado. Por favor, seleccioná otro turno."
        default:
            return "Error al cargar servicios"
    }
}