import { ServiceError } from "../../errors/serviceErrors"
import { Result } from "../../shared/types/result"
import { supabase } from "../../config/Supabase"
import { ServiceEmployeeError } from "../../errors/ServiceEmployeeError"

const TABLE_SERVICIOS_EMPLEADOS = "servicios_empleados"

export class ServiceEmployeeRepository {

  async addEmployeeToService(serviceId: string, employeeIds: number[]): Promise<Result<void, ServiceEmployeeError>> {
    try {

      const relations = employeeIds.map(employeeId => ({
        servicio_id: serviceId,
        empleados_id: employeeId
      }))

      const { error } = await supabase
        .from(TABLE_SERVICIOS_EMPLEADOS)
        .insert(relations);

      if (error) {
        throw error;
      }

      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleServiceEmployeeError(error)
    }
  }

  async deleteEmployeesByService(serviceId: string): Promise<Result<void, ServiceError>> {
    try {

      const { error } = await supabase
        .from(TABLE_SERVICIOS_EMPLEADOS)
        .delete()
        .eq("servicio_id", serviceId);

      if (error) {
        throw error
      }
      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleServiceEmployeeError(error)
    }
  }
}

export const handleServiceEmployeeError = (
  error: any
): Result<never, ServiceEmployeeError> => {

  console.log("SERVICE ERROR:", error)

  switch (error?.code) {

    // RLS / permisos
    case "42501":
      return { ok: false, error: "permission" }

    // no encontrado
    case "PGRST116":
      return { ok: false, error: "not-found" }

    // timeout/network
    case "57014":
      return { ok: false, error: "timeout" }

    // postgres connection
    case "08006":
    case "08001":
      return { ok: false, error: "network" }

    default:
      return { ok: false, error: "unknown" }
  }

  return { ok: false, error: "unknown" };
};

export const serviceEmployeeRepository = new ServiceEmployeeRepository();