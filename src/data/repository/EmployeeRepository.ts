import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"
import { Employee } from "../../domain/models/Service"
import { withTimeout } from "../../utils/withTimeOut"
import { db } from "../../config/Firebase"
import { Result } from "../../shared/types/result"
import { EmployeeResponse, employeeToDomain } from "../remote/response/EmployeeResponse"
import { FirebaseError } from "firebase/app"
import { EmployeeError } from "../../errors/employeeError"

const COLLECTION_EMPLOYEE = "employee"

export class EmployeeRepository {

  async getEmployees(): Promise<Result<Employee[], EmployeeError>> {
    try {
      const snapshot = await withTimeout(
        getDocs(collection(db, COLLECTION_EMPLOYEE)),
        10000
      )

      const services = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as EmployeeResponse

        return employeeToDomain(docSnap.id, data)
      })

      return { ok: true, data: services }

    } catch (error) {
      return handleEmployeeError(error)
    }
  }

  async deleteEmployee(id: string): Promise<Result<void, EmployeeError>> {
    try {

      await withTimeout(
        deleteDoc(
          doc(db, COLLECTION_EMPLOYEE, id)
        ),
        10000
      )

      return { ok: true, data: undefined }

    } catch (error) {
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
