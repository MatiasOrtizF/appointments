import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { Employee, Service } from "../../domain/models/Service"
import { db } from "../../config/Firebase"
import { withTimeout } from "../../utils/withTimeOut"
import { ServiceError } from "../../errors/serviceErrors"
import { Result } from "../../shared/types/result"
import { FirebaseError } from "firebase/app"
import { ServiceResponse, serviceToDomain } from "../remote/response/ServiceResponse"
import { EmployeeResponse, employeeToDomain } from "../remote/response/EmployeeResponse"
import { CreateServiceRequest } from "../../domain/models/CreateServiceRequest"
import { EditServiceRequest } from "../../domain/models/EditServiceRequest"
import { supabase } from "../../config/Supabase"

const COLLECTION_SERVICE = "service"
const COLLECTION_EMPLOYEE = "employee"

export class ServiceRepository {

  async getServices(): Promise<Result<Service[], ServiceError>> {
    try {
      const { data, error } = await supabase
        .from("servicios")
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
        .from("servicios")
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

      await addDoc(collection(db, COLLECTION_SERVICE), request);

      return { ok: true, data: undefined }

    } catch (error) {
      return handleServiceError(error)
    }
  }

  async editServices(service: EditServiceRequest): Promise<Result<void, ServiceError>> {
    try {

      const serviceRef = doc(db, COLLECTION_SERVICE, service.id)

      const serviceResponse: ServiceResponse = {
        title: service.name,
        description: service.description,
        price: service.price,
        duration_min: service.duration_min,
        img: service.img,
        employees: [],
        days: service.days,
        hourStart: service.hourStart,
        hourEnd: service.hourEnd
      }

      await withTimeout(
        updateDoc(serviceRef, {
          ...serviceResponse
        }),
        10000
      )

      return {
        ok: true,
        data: undefined
      }

    } catch (error) {
      return handleServiceError(error)
    }
  }

  async deleteService(id: string): Promise<Result<void, ServiceError>> {
    try {

      await withTimeout(
        deleteDoc(
          doc(db, COLLECTION_SERVICE, id)
        ),
        10000
      )

      return { ok: true, data: undefined }

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