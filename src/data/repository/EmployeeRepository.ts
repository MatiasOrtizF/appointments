import { Employee } from "../../domain/models/Service"
import { Result } from "../../shared/types/result"
import { employeeToDomain } from "../remote/response/EmployeeResponse"
import { FirebaseError } from "firebase/app"
import { EmployeeError } from "../../errors/employeeError"
import { supabase } from "../../config/Supabase"
import { CreateEmployeeRequest } from "../../domain/models/CreateEmployeeRequest"
import { EditEmployeeInput } from "../../domain/models/employee/EditEmployeeInput"

const TABLE_EMPLEADOS = "empleados"

export class EmployeeRepository {

  async getEmployees(): Promise<Result<Employee[], EmployeeError>> {
    try {

      const { data, error } = await supabase
        .from(TABLE_EMPLEADOS)
        .select("*")

      if (error) throw error;

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
      return handleEmployeeError(error)
    }
  }

  async deleteEmployee(employeeId: number): Promise<Result<void, EmployeeError>> {
    try {

      const { error } = await supabase
        .from(TABLE_EMPLEADOS)
        .delete()
        .eq("id", employeeId);

      if (error) {
        console.log("error al borrar empleado ", error)
        throw error
      }
      return {
        ok: true,
        data: undefined
      };


    } catch (error) {
      return handleEmployeeError(error)
    }
  }

  async addEmployee(request: CreateEmployeeRequest): Promise<Result<void, EmployeeError>> {
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
        console.log("error addEmployee", error);
        throw error;
      }

      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleEmployeeError(error)
    }
  }

  async editEmployee(request: EditEmployeeInput): Promise<Result<void, EmployeeError>> {
    try {
      console.log("llame a editar empleado")
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
        console.log("error 1", error)
        throw error
      }

      return {
        ok: true,
        data: undefined,
      }

    } catch (error) {
      console.log("error 2", error)

      return handleEmployeeError(error)
    }
  }

}

const handleEmployeeError = (
  error: unknown
): Result<never, EmployeeError> => {

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return { ok: false, error: "permission" };

      case "unauthenticated":
      case "auth/unauthenticated":
        return { ok: false, error: "unauthenticated" };

      case "unavailable":
      case "failed-precondition":
        return { ok: false, error: "network" };

      case "deadline-exceeded":
        return { ok: false, error: "timeout" };

      case "not-found":
        return { ok: false, error: "not-found" };

      case "already-exists":
      case "aborted":
        return { ok: false, error: "slot_taken" };

      default:
        return { ok: false, error: "unknown" };
    }
  }

  return { ok: false, error: "unknown" };
};

export const employeeRepository = new EmployeeRepository();
