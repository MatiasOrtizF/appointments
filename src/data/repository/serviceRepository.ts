import { Employee, Service } from "../../domain/models/Service"
import { db } from "../../config/Firebase"
import { withTimeout } from "../../utils/withTimeOut"
import { ServiceError } from "../../errors/serviceErrors"
import { Result } from "../../shared/types/result"
import { serviceToDomain } from "../remote/response/ServiceResponse"
import { employeeToDomain } from "../remote/response/EmployeeResponse"
import { CreateServiceRequest } from "../../domain/models/CreateServiceRequest"
import { EditServiceRequest } from "../../domain/models/EditServiceRequest"
import { supabase } from "../../config/Supabase"
import { EditServiceInput } from "../../domain/models/service/EditServiceInput"

const COLLECTION_SERVICE = "service"
const COLLECTION_EMPLOYEE = "employee"
const TABLE_SERVICIOS = "servicios"

export class ServiceRepository {

  async getServices(): Promise<Result<Service[], ServiceError>> {
    try {
      const { data, error } = await supabase
        .from(TABLE_SERVICIOS)
        .select(`
    id,
    title,
    description,
    price,
    duration_minutes,
    image_url,
    available_days,
    start_time,
    end_time,
    servicios_empleados (
      empleado:empleados (
        id,
        name,
        image_url
      )
    )
  `)
      if (error) throw error

      const services: Service[] = (data ?? []).map((service) => {
        const employees =
          service.servicios_empleados?.map((se: any) => se.empleado) ?? []

        return serviceToDomain({
          id: service.id,
          title: service.title,
          description: service.description,
          price: service.price,
          duration_minutes: service.duration_minutes,
          image_url: service.image_url,
          available_days: service.available_days,
          start_time: service.start_time,
          end_time: service.end_time,
          employees
        })
      })

      return { ok: true, data: services }
    } catch (error) {
      console.log("otro error", error)
      return handleServiceError(error)
    }
  }

  async getService(id: string): Promise<Result<Service, ServiceError>> {
    try {

      const { data, error } = await supabase
        .from(TABLE_SERVICIOS)
        .select(`
        id,
        title,
        description,
        price,
        duration_minutes,
        image_url,
        available_days,
        start_time,
        end_time,
        servicios_empleados (
          empleado:empleados (
            id,
            name,
            image_url
          )
        )
      `)
        .eq("id", id)
        .single()

      if (error) throw error
      console.log("data", data)
      const employees: Employee[] =
        data.servicios_empleados?.map((se: any) =>
          employeeToDomain(se.empleado)
        ) ?? []

      const service = serviceToDomain({
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        duration_minutes: data.duration_minutes,
        image_url: data.image_url,
        available_days: data.available_days,
        start_time: data.start_time,
        end_time: data.end_time,
        employees
      })

      return {
        ok: true,
        data: service
      }

    } catch (error) {
      return handleServiceError(error)
    }
  }

  async addService(request: CreateServiceRequest): Promise<Result<void, ServiceError>> {
    try {

      const { error } = await supabase
        .from(TABLE_SERVICIOS)
        .insert({
          title: request.name,
          description: request.description,
          price: request.price,
          duration_minutes: request.duration_min,
          image_url: request.imgUrl,
          available_days: request.days,
          start_time: request.hourStart,
          end_time: request.hourEnd
        });

      if (error) {
        console.log("error addAppointment", error);
        throw error;
      }

      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleServiceError(error)
    }
  }

  async editService(service: EditServiceInput): Promise<Result<void, ServiceError>> {
    try {
      console.log("llame a edtiar servicio")
      const { error } = await supabase
        .from(TABLE_SERVICIOS)
        .update({
          title: service.name,
          description: service.description,
          price: service.price,
          duration_minutes: service.duration,
          image_url: service.newImage,
          available_days: service.days,
          start_time: service.hourStart,
          end_time: service.hourEnd,
        })
        .eq("id", service.id)

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

      return handleServiceError(error)
    }
  }

  async deleteService(serviceId: string): Promise<Result<void, ServiceError>> {
    try {

      const { error } = await supabase
        .from(TABLE_SERVICIOS)
        .delete()
        .eq("id", serviceId);

      if (error) {
        throw error
      }
      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleServiceError(error)
    }
  }
}

export const handleServiceError = (
  error: any
): Result<never, ServiceError> => {

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

export const serviceRepository = new ServiceRepository();