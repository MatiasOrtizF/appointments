import { collection, getDocs, limit, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Appointment } from '../../domain/models/Appointment'
import { AppointmentResponse, toDomain } from '../remote/response/AppointmentResponse';
import { db } from '../../config/Firebase';
import { Result } from '../../shared/types/result';
import { AppointmentError } from '../../errors/appointmentErrors';
import { FirebaseError } from 'firebase/app';

export class AdminRepository {
      async getAdminAppointments(uid: string): Promise<Result<Appointment[], AppointmentError>> {
        try {

        const now = Timestamp.fromDate(new Date())
    
          const q = query(
            collection(db, "appointment"),
            where("uid", "==", uid),
            where("dateTime", ">", now),
            orderBy("dateTime", "asc"),
            limit(3)
          );
    
          const snapshot = await getDocs(q);
    
          const appointments = snapshot.docs.map((doc) => {
            const data = doc.data() as AppointmentResponse
            return toDomain(doc.id, data)
          })
    
          return { ok: true, data: appointments }
    
        } catch (error) {
          console.log(error)
    
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
    
          return { ok: false, error: "unknown" }
        }
      };
}

export const adminRepository = new AdminRepository();