import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { Service } from "../../domain/models/Service"
import { db } from "../../config/Firebase"
import { withTimeout } from "../../utils/withTimeOut"
import { ServiceError } from "../../errors/serviceErrors"
import { Result } from "../../shared/types/result"
import { FirebaseError } from "firebase/app"
import { ServiceResponse, toDomain } from "../remote/response/ServiceResponse"
import { EmployeeResponse, employeeToDomain } from "../remote/response/EmployeeResponse"

const COLLECTION_SERVICE = "service"

export class ServiceRepository {

  async getServices(): Promise<Result<Service[], ServiceError>> {
    try {
      const snapshot = await withTimeout(
        getDocs(collection(db, "service")),
        10000
      )

      const services = await Promise.all(
        snapshot.docs.map(async (docSnap) => {

          const data = docSnap.data() as ServiceResponse

          const employees = await Promise.all(
            data.employees.map(async (ref) => {
              const employeeSnap = await getDoc(ref)

              const employeeData = employeeSnap.data() as EmployeeResponse

              return employeeToDomain(
                employeeSnap.id,
                employeeData
              )
            })
          )

          return toDomain(docSnap.id, data, employees)
        })
      )
      return { ok: true, data: services }

    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "permission-denied":
            return { ok: false, error: "permission" }

          case "unavailable":
            return { ok: false, error: "network" }

          case "deadline-exceeded":
            return { ok: false, error: "timeout" }

          default:
            return { ok: false, error: "unknown" }
        }
      }

      if (error instanceof Error && error.message === "Timeout") {
        return { ok: false, error: "timeout" }
      }

      return { ok: false, error: "unknown" }

    }
  }

  async getService(id: string): Promise<Result<Service, ServiceError>> {
    try {
      const serviceDoc = await getDoc(
        doc(db, COLLECTION_SERVICE, id)
      )

      if (!serviceDoc.exists()) {
        return { ok: false, error: "unknown" };
      }

      const data = serviceDoc.data() as ServiceResponse;

      const employees = await Promise.all(
        data.employees.map(async (ref) => {
          const employeeSnap = await getDoc(ref)

          const employeeData = employeeSnap.data() as EmployeeResponse

          return employeeToDomain(
            employeeSnap.id,
            employeeData
          )
        })
      )

      return {
        ok: true,
        data: toDomain(serviceDoc.id, data, employees),
      };


    } catch (error) {

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "permission-denied":
            return { ok: false, error: "permission" }

          case "unavailable":
            return { ok: false, error: "network" }

          case "deadline-exceeded":
            return { ok: false, error: "timeout" }

          default:
            return { ok: false, error: "unknown" }
        }
      }

      if (error instanceof Error && error.message === "Timeout") {
        return { ok: false, error: "timeout" }
      }

      return { ok: false, error: "unknown" }

    }
  }
}


export const serviceRepository = new ServiceRepository();