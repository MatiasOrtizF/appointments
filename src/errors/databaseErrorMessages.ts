import { DatabaseError } from "./databaseError"

export const mapDatabaseErrorToMessage = (
  error: DatabaseError
): string => {

 switch (error) {

    case "timeout":
      return "La solicitud tardó demasiado";

    case "permission":
      return "No tenés permisos para realizar esta acción";

    case "network":
      return "Sin conexión a internet";

    case "unauthenticated":
      return "Tenés que iniciar sesión";

    case "validation":
      return "Los datos ingresados no son válidos";

    case "conflict":
      return "El registro ya existe";

    case "not-found":
      return "No se encontró el registro";

    default:
      return "Algo salió mal, intentá más tarde";
  }
}