import { addDoc, collection, doc, getDocs, limit, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { Appointment } from '../../domain/models/Appointment'
import { AppointmentResponse, toDomain } from '../remote/response/AppointmentResponse';
import { db } from '../../config/Firebase';
import { Result } from '../../shared/types/result';
import { AppointmentError } from '../../errors/appointmentErrors';
import { FirebaseError } from 'firebase/app';
import { CreateAppointmentRequest } from '../../domain/models/CreateAppointmentRequest';

const COLLECTION_APPOINTMENT = "appointment"

export class AppointmentRepository {
  async getUpcomingAppointments(uid: string): Promise<Result<Appointment[], AppointmentError>> {
    try {

      const now = Timestamp.fromDate(new Date())

      const q = query(
        collection(db, COLLECTION_APPOINTMENT),
        where("uid", "==", uid),
        where("dateTime", ">", now),
        limit(10)
      );

      const snapshot = await getDocs(q);

      const appointments = snapshot.docs.map((doc) => {
        const data = doc.data() as AppointmentResponse
        return toDomain(doc.id, data)
      })

      return { ok: true, data: appointments }

    } catch (error) {
      return handleAppointmentError(error);
    }
  };

  async getPastAppointments(uid: string): Promise<Result<Appointment[], AppointmentError>> {
    console.log("llegaste")
    try {

      const now = Timestamp.fromDate(new Date())

      const q = query(
        collection(db, COLLECTION_APPOINTMENT),
        where("uid", "==", uid),
        where("dateTime", "<", now),
        limit(10)
      );

      const snapshot = await getDocs(q);

      const appointments = snapshot.docs.map((doc) => {
        const data = doc.data() as AppointmentResponse
        return toDomain(doc.id, data)
      })

      console.log("Mira esto" + appointments)

      return { ok: true, data: appointments }

    } catch (error) {
      return handleAppointmentError(error);
    }
  };

  async addAppointment(request: CreateAppointmentRequest): Promise<Result<void, AppointmentError>> {
    try {

      await addDoc(
        collection(db, COLLECTION_APPOINTMENT),
        request
      );

      return { ok: true, data: undefined }

    } catch (error) {
      return handleAppointmentError(error);
    }
  };
}

const handleAppointmentError = (
  error: unknown
): Result<never, AppointmentError> => {

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "permission-denied":
        return { ok: false, error: "permission" };

      case "unavailable":
        return { ok: false, error: "network" };

      case "deadline-exceeded":
        return { ok: false, error: "timeout" };

      default:
        return { ok: false, error: "unknown" };
    }
  }

  return { ok: false, error: "unknown" };
};

export const appointmentRepository = new AppointmentRepository();