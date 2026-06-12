import { Result } from "../../shared/types/result"
import { supabase } from "../../config/Supabase"
import { DatabaseError, handleDatabaseError } from "../../errors/databaseError"

const TABLE_SERVICIOS_EMPLEADOS = "servicios_empleados"

export class ServiceEmployeeRepository {

  async addEmployeeToService(serviceId: string, employeeIds: number[]): Promise<Result<void, DatabaseError>> {
    try {

      const relations = employeeIds.map(employeeId => ({
        servicio_id: serviceId,
        empleados_id: employeeId
      }))

      const { error } = await supabase
        .from(TABLE_SERVICIOS_EMPLEADOS)
        .insert(relations);
        
      if (error) {
        return handleDatabaseError(error);
      }

      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleDatabaseError(error)
    }
  }

  async deleteEmployeesByService(serviceId: string): Promise<Result<void, DatabaseError>> {
    try {

      const { error } = await supabase
        .from(TABLE_SERVICIOS_EMPLEADOS)
        .delete()
        .eq("servicio_id", serviceId);

      if (error) {
        return handleDatabaseError(error)
      }
      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleDatabaseError(error)
    }
  }
}

export const serviceEmployeeRepository = new ServiceEmployeeRepository();