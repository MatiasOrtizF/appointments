import { collection, getDocs } from "firebase/firestore"
import { Service } from "../../domain/models/Service"
import { db } from "../../config/Firebase"
import { ServiceResponse, toDomain } from "../remote/response/serviceResponse"
import { withTimeout } from "../../utils/withTimeOut"
import { ServiceError } from "../../errors/serviceErrors"
import { Result } from "../../shared/types/result"
import { FirebaseError } from "firebase/app"

export class ServiceRepository {
  async getServices(): Promise<Result<Service[], ServiceError>> {
    try {
      const snapshot = await withTimeout(
        getDocs(collection(db, "service")),
        10000
      )

      const services = snapshot.docs.map((doc) => {
        const data = doc.data() as ServiceResponse
        return toDomain(doc.id, data)
      })

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
}


export const serviceRepository = new ServiceRepository();