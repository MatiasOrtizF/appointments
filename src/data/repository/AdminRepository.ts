import { collection, getDocs, limit, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Appointment } from '../../domain/models/Appointment'
import { AppointmentResponse, toDomain } from '../remote/response/AppointmentResponse';
import { db } from '../../config/Firebase';
import { Result } from '../../shared/types/result';
import { AppointmentError } from '../../errors/appointmentErrors';
import { FirebaseError } from 'firebase/app';

const COLLECTION_APPOINTMENT = "appointment"

export class AdminRepository {
  async getUpcomingAdminAppointments(uid: string): Promise<Result<Appointment[], AppointmentError>> {
    try {

      const q = query(
        collection(db, COLLECTION_APPOINTMENT),
        where("uid", "==", uid),
        where("dateTime", ">", getTodayRange().now),
        where("dateTime", "<", getTodayRange().startOfTomorrow),
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
      return handleAdminAppointmentError(error)
    }
  };

  async getAdminAppointments(uid: string): Promise<Result<Appointment[], AppointmentError>> {
    try {

      const q = query(
        collection(db, COLLECTION_APPOINTMENT),
        where("uid", "==", uid),
        where("dateTime", ">", getTodayRange().now),
        where("dateTime", "<", getTodayRange().startOfTomorrow),
        orderBy("dateTime", "asc"),
        limit(10)
      );

      const snapshot = await getDocs(q);

      const appointments = snapshot.docs.map((doc) => {
        const data = doc.data() as AppointmentResponse
        return toDomain(doc.id, data)
      })

      return { ok: true, data: appointments }

    } catch (error) {
      return handleAdminAppointmentError(error)
    }
  };
}

const getTodayRange = () => {
  const now = Timestamp.fromDate(new Date())

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const startOfTomorrow = Timestamp.fromDate(tomorrow);
  return { now, startOfTomorrow }
}

const handleAdminAppointmentError = (
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

export const adminRepository = new AdminRepository();