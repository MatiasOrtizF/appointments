import { collection, getDocs, limit, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { Appointment } from '../../domain/models/Appointment'
import { AppointmentResponse, appointmentToDomain } from '../remote/response/AppointmentResponse';
import { db } from '../../config/Firebase';
import { Result } from '../../shared/types/result';
import { AppointmentError } from '../../errors/appointmentErrors';
import { FirebaseError } from 'firebase/app';
import { supabase } from '../../config/Supabase';
import { employeeToDomain } from '../remote/response/EmployeeResponse';
import { serviceToDomain } from '../remote/response/ServiceResponse';
import { authUserToDomain } from '../remote/response/AuthUserResponse';

const COLLECTION_APPOINTMENT = "appointment"
const TABLE_TURNOS = "turnos"

export class AdminRepository {
  async getUpcomingTodayAppointments(): Promise<Result<Appointment[], AppointmentError>> {
    try {

      //const now = new Date().toISOString();
      const { now, startOfTomorrow } = getTodayRange()

      const { data, error } = await supabase
        .from(TABLE_TURNOS)
        .select(`
          *,
          empleados (*),
          servicios (*),
          usuarios(*)
        `)
        .neq("status", "cancelled")
        .gt("appointment_at", now.toISOString())
        .lt("appointment_at", startOfTomorrow.toISOString())
        .order("appointment_at", { ascending: true })
        .limit(3)

      if (error) {
        console.log("error de admin", error)
        throw error
      }

      const appointments: Appointment[] = (data ?? []).map((appointment) => {

        (data ?? []).forEach((appointment) => {
          console.log("USUARIO", appointment.usuarios)
          console.log("EMPLEADO", appointment.empleados)
          console.log("SERVICIO", appointment.servicios)
        })
        return appointmentToDomain({
          id: appointment.id,
          created_at: appointment.created_at,
          user: authUserToDomain(appointment.usuarios),
          employee: employeeToDomain(appointment.empleados),
          service: serviceToDomain(appointment.servicios),
          appointment_at: appointment.appointment_at,
          status: appointment.status,
        })
      })

      return {
        ok: true,
        data: appointments
      }

    } catch (error) {
      console.log("error desde admin", error)
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
        return appointmentToDomain(doc.id, data)
      })

      return { ok: true, data: appointments }

    } catch (error) {
      return handleAdminAppointmentError(error)
    }
  };
}

const getTodayRange = () => {
  const now = new Date()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return {
    now,
    startOfTomorrow: tomorrow
  }
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