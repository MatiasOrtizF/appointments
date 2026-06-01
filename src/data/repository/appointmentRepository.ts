import { collection, doc, getDoc, getDocs, limit, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { Appointment } from '../../domain/models/Appointment'
import { AppointmentResponse, appointmentToDomain } from '../remote/response/AppointmentResponse';
import { db } from '../../config/Firebase';
import { Result } from '../../shared/types/result';
import { AppointmentError } from '../../errors/appointmentErrors';
import { FirebaseError } from 'firebase/app';
import { CreateAppointmentRequest } from '../../domain/models/CreateAppointmentRequest';
import { supabase } from '../../config/Supabase';
import { employeeToDomain } from '../remote/response/EmployeeResponse';
import { serviceToDomain } from '../remote/response/ServiceResponse';

const COLLECTION_APPOINTMENT = "appointment"
const TABLE_TURNOS = "turnos"

export class AppointmentRepository {

  async getUpcomingAppointments(uid: string): Promise<Result<Appointment[], AppointmentError>> {
    try {

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from(TABLE_TURNOS)
        .select(`
          *,
          empleados (*),
          servicios (*)
        `)
        .eq("user_id", uid)
        .gt("appointment_at", now)
        .order("appointment_at", { ascending: true })
        .limit(10);

      if (error) throw error;

      const appointments: Appointment[] = (data ?? []).map((appointment) => {
        return appointmentToDomain({
          id: appointment.id,
          created_at: appointment.created_at,
          employee: employeeToDomain(appointment.empleados),
          service: serviceToDomain(appointment.servicios),
          appointment_at: appointment.appointment_at,
          status: appointment.status,
        })
      })

      return {
        ok: true,
        data: appointments
      };

    } catch (error) {
      return handleAppointmentError(error);
    }
  };

  async getPastAppointments(uid: string): Promise<Result<Appointment[], AppointmentError>> {
    try {

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from(TABLE_TURNOS)
        .select(`
          *,
          empleados (*),
          servicios (*)
        `)
        .eq("user_id", uid)
        .lt("appointment_at", now)
        .order("appointment_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const appointments: Appointment[] = (data ?? []).map((appointment) => {
        return appointmentToDomain({
          id: appointment.id,
          created_at: appointment.created_at,
          employee: employeeToDomain(appointment.empleados),
          service: serviceToDomain(appointment.servicios),
          appointment_at: appointment.appointment_at,
          status: appointment.status,
        })
      })

      return { ok: true, data: appointments }

    } catch (error) {
      return handleAppointmentError(error);
    }
  };

  async addAppointment(request: CreateAppointmentRequest): Promise<Result<void, AppointmentError>> {
    try {

      console.log("important!! ", request.appointmentAt)
      const { error } = await supabase
        .from(TABLE_TURNOS)
        .insert({
          user_id: request.userId,
          employee_id: request.employeeId,
          service_id: request.serviceId,
          appointment_at: request.appointmentAt,
        });

      if (error) {
        console.log("error addAppointment", error);

        if (error.code === "23505") {
          return { ok: false, error: "slot_taken" };
        }

        throw error;
      }

      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleAppointmentError(error);
    }
  };

  async getHoursAvailable(serviceId: string, employeeId: string, day: string): Promise<Result<string[], AppointmentError>> {
    try {
      const startDate = `${day}T00:00:00-03:00`;
      const endDate = `${day}T23:59:59-03:00`;

      const { data, error } = await supabase
        .from(TABLE_TURNOS)
        .select(`appointment_at`)
        .eq("service_id", serviceId)
        .eq("employee_id", employeeId)
        .gte("appointment_at", startDate)
        .lte("appointment_at", endDate);

      if (error) throw error

      const appointments = data.map(item =>
        new Date(item.appointment_at)
          .toLocaleTimeString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          })
      );

      console.log("horarios ocupados", appointments)

      return { ok: true, data: appointments }
    } catch (error) {
      console.log("otro error", error)
      return handleAppointmentError(error)
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