import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { Employee, Service } from "../../domain/models/Service"
import { db } from "../../config/Firebase"
import { withTimeout } from "../../utils/withTimeOut"
import { ServiceError } from "../../errors/serviceErrors"
import { Result } from "../../shared/types/result"
import { FirebaseError } from "firebase/app"
import { ServiceResponse, toDomain } from "../remote/response/ServiceResponse"
import { EmployeeResponse, employeeToDomain } from "../remote/response/EmployeeResponse"
import { CreateServiceRequest } from "../../domain/models/CreateServiceRequest"
import { EditServiceRequest } from "../../domain/models/EditServiceRequest"

const COLLECTION_SERVICE = "service"
const COLLECTION_EMPLOYEE = "employee"

export class ServiceRepository {

  async getServices(): Promise<Result<Service[], ServiceError>> {
    try {
      const snapshot = await withTimeout(
        getDocs(collection(db, COLLECTION_SERVICE)),
        10000
      )

      const employeesSnapshot = await getDocs(collection(db, COLLECTION_EMPLOYEE))

      const employeesMap = new Map(
        employeesSnapshot.docs.map(doc => [
          doc.id,
          employeeToDomain(doc.id, doc.data() as EmployeeResponse)
        ])
      )

      const services = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as ServiceResponse

        const employees = data.employees
          .map(id => employeesMap.get(id))
          .filter((e): e is Employee => e !== undefined);

        return toDomain(docSnap.id, data, employees)
      })

      return { ok: true, data: services }

    } catch (error) {
      return handleServiceError(error)
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
        data.employees.map(async (id) => {
          const employeeSnap = await getDoc(doc(db, COLLECTION_EMPLOYEE, id));

          if (!employeeSnap.exists()) return undefined;

          const employeeData = employeeSnap.data() as EmployeeResponse;

          return employeeToDomain(
            employeeSnap.id,
            employeeData
          )
        })
      )

      const validEmployees = employees.filter(
        (e): e is Employee => e !== undefined
      );

      return {
        ok: true,
        data: toDomain(serviceDoc.id, data, validEmployees),
      };


    } catch (error) {
      console.log(error)
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
        name: service.name,
        description: service.description,
        price: service.price,
        duration_min: service.duration_min,
        img: service.img,
        employees: service.employees.map(employeeId => employeeId),
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

const handleServiceError = (
  error: unknown
): Result<never, ServiceError> => {

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return { ok: false, error: "permission" };

      case "unavailable":
      case "failed-precondition":
        return { ok: false, error: "network" };

      case "deadline-exceeded":
        return { ok: false, error: "timeout" };

      case "not-found":
        return { ok: false, error: "not-found" };

      default:
        return { ok: false, error: "unknown" };
    }
  }

  return { ok: false, error: "unknown" };
};

export const serviceRepository = new ServiceRepository();