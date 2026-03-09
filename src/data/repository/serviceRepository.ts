import { collection, getDocs } from "firebase/firestore"
import { Service } from "../../domain/models/Service"
import { db } from "../../config/Firebase"
import { ServiceResponse, toDomain } from "../remote/response/serviceResponse"
import { withTimeout } from "../../utils/withTimeOut"
export const getServices = async (): Promise<Service[]> => {
  try {

    const snapshot = await withTimeout(
      getDocs(collection(db, "service")),
      10000
    )

    return snapshot.docs.map((doc) => {
      const data = doc.data() as ServiceResponse
      return toDomain(doc.id, data)
    })

  } catch (error) {

    if (error instanceof Error && error.message === "Timeout") {
      console.error("ServiceRepo: Timeout al obtener los servicios", error)
    } else {
      console.error("ServiceRepo: Error getting services", error)
    }

    return []
  }
}