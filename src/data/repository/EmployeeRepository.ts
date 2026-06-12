import { Employee } from "../../domain/models/service/Service"
import { Result } from "../../shared/types/result"
import { employeeToDomain } from "../remote/response/EmployeeResponse"
import { supabase } from "../../config/Supabase"
import { CreateEmployeeRequest } from "../../domain/models/employee/CreateEmployeeRequest"
import { EditEmployeeInput } from "../../domain/models/employee/EditEmployeeInput"
import { DatabaseError, handleDatabaseError } from "../../errors/databaseError"

const TABLE_EMPLEADOS = "empleados"

export class EmployeeRepository {

  async getEmployees(): Promise<Result<Employee[], DatabaseError>> {
    try {

      const { data, error } = await supabase
        .from(TABLE_EMPLEADOS)
        .select("*")

      if (error) {
        return handleDatabaseError(error)
      }

      const employees: Employee[] = (data ?? []).map((employee) => {
        return employeeToDomain({
          id: employee.id,
          name: employee.name,
          last_name: employee.last_name,
          image_url: employee.image_url,
          role: employee.role,
          status: employee.status
        })
      })

      return {
        ok: true,
        data: employees
      };

    } catch (error) {
      return handleDatabaseError(error)
    }
  }

  async deleteEmployee(employeeId: number): Promise<Result<void, DatabaseError>> {
    try {

      const { error } = await supabase
        .from(TABLE_EMPLEADOS)
        .delete()
        .eq("id", employeeId);

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

  async addEmployee(request: CreateEmployeeRequest): Promise<Result<void, DatabaseError>> {
    try {

      const { error } = await supabase
        .from(TABLE_EMPLEADOS)
        .insert({
          image_url: request.imageUrl,
          name: request.name,
          last_name: request.lastName,
          status: request.status,
        });

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

  async editEmployee(request: EditEmployeeInput): Promise<Result<void, DatabaseError>> {
    try {
      const { error } = await supabase
        .from(TABLE_EMPLEADOS)
        .update({
          image_url: request.newImage,
          name: request.name,
          last_name: request.lastName,
          status: request.status
        })
        .eq("id", request.id)

      if (error) {
        return handleDatabaseError(error)
      }

      return {
        ok: true,
        data: undefined,
      }

    } catch (error) {
      return handleDatabaseError(error)
    }
  }

}

export const employeeRepository = new EmployeeRepository();
