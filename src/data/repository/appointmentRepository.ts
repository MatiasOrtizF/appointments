import { addDoc, collection, doc, getDoc, getDocs, limit, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { Appointment } from '../../domain/models/Appointment'
import { AppointmentResponse, toDomain } from '../remote/response/AppointmentResponse';
import { db } from '../../config/Firebase';
import { Result } from '../../shared/types/result';
import { AppointmentError } from '../../errors/appointmentErrors';
import { FirebaseError } from 'firebase/app';
import { CreateAppointmentRequest } from '../../domain/models/CreateAppointmentRequest';
import { withTimeout } from '../../utils/withTimeOut';
import { Hour } from '../../utils/generateHours';

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
      const appointmentId =
        `${request.employeeId}_${request.dateTime.toMillis()}`;

      const appointmentRef = doc(
        db,
        COLLECTION_APPOINTMENT,
        appointmentId
      );

      const snapshot = await getDoc(appointmentRef);

      if (snapshot.exists()) {
        return { ok: false, error: "slot_taken" };
      }

      await setDoc(appointmentRef, {
        ...request,
        id: appointmentId,
        createdAt: Timestamp.now(),
      });

      return { ok: true, data: undefined }

    } catch (error) {
      return handleAppointmentError(error);
    }
  };

  async getHoursAvailable(serviceId: string, day: string): Promise<Result<string[], AppointmentError>> {
    try {

      const q = query(
        collection(db, COLLECTION_APPOINTMENT),
        where("serviceId", "==", serviceId),
        where("date", "==", day),
      );

      const snapshot = await getDocs(q);

      const hours = snapshot.docs.map((doc) => {
        const data = doc.data() as AppointmentResponse
        return data.time
      })

      return { ok: true, data: hours }

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

export const appointmentRepository = new AppointmentRepository();