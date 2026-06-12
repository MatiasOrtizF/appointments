import { Appointment } from '../../domain/models/appointments/Appointment'
import { appointmentToDomain } from '../remote/response/AppointmentResponse';
import { Result } from '../../shared/types/result';
import { CreateAppointmentRequest } from '../../domain/models/appointments/CreateAppointmentRequest';
import { supabase } from '../../config/Supabase';
import { employeeToDomain } from '../remote/response/EmployeeResponse';
import { serviceToDomain } from '../remote/response/ServiceResponse';
import { authUserToDomain } from '../remote/response/AuthUserResponse';
import { DatabaseError, handleDatabaseError } from '../../errors/databaseError';
import { AddAppointmentError } from '../../errors/addAppointmentErrors';

const TABLE_TURNOS = "turnos"

export class AppointmentRepository {

  async getUpcomingAppointments(uid: string): Promise<Result<Appointment[], DatabaseError>> {
    try {

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from(TABLE_TURNOS)
        .select(`
          *,
          empleados (*),
          servicios (*),
          usuarios (*)
        `)
        .eq("user_id", uid)
        .neq("status", "cancelled")
        .gt("appointment_at", now)
        .order("appointment_at", { ascending: true })
        .limit(10);

      if (error) {
        return handleDatabaseError(error)
      }

      const appointments: Appointment[] = (data ?? []).map((appointment) => {
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
      };

    } catch (error) {
      return handleDatabaseError(error);
    }
  };

  async getPastAppointments(uid: string): Promise<Result<Appointment[], DatabaseError>> {
    try {

      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from(TABLE_TURNOS)
        .select(`
          *,
          empleados (*),
          servicios (*),
          usuarios (*)
        `)
        .eq("user_id", uid)
        .neq("status", "cancelled")
        .lt("appointment_at", now)
        .order("appointment_at", { ascending: false })
        .limit(10);

      if (error) {
        return handleDatabaseError(error)
      }

      const appointments: Appointment[] = (data ?? []).map((appointment) => {
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

      return { ok: true, data: appointments }

    } catch (error) {
      return handleDatabaseError(error);
    }
  };

  async cancelAppointment(appointmentId: string): Promise<Result<void, DatabaseError>> {
    try {

      const { error } = await supabase
        .from(TABLE_TURNOS)
        .delete()
        .eq("id", appointmentId);

      if (error) {
        return handleDatabaseError(error)
      }
      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleDatabaseError(error);
    }
  }

  async addAppointment(request: CreateAppointmentRequest): Promise<Result<void, AddAppointmentError>> {
    try {
      const { error } = await supabase
        .from(TABLE_TURNOS)
        .insert({
          user_id: request.userId,
          employee_id: request.employeeId,
          service_id: request.serviceId,
          appointment_at: request.appointmentAt,
        });

      if (error) {
        if (
          error.code === "23505" &&
          error.message.includes("unique_employee_slot")
        ) {
          return { ok: false, error: "slot_taken" };
        }

        return handleDatabaseError(error)
      }

      return {
        ok: true,
        data: undefined
      };

    } catch (error) {
      return handleDatabaseError(error);
    }
  };

  async getHoursAvailable(serviceId: string, employeeId: string, day: string): Promise<Result<string[], DatabaseError>> {
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

      if (error) {
        return handleDatabaseError(error)
      }

      const appointments = data.map(item =>
        new Date(item.appointment_at)
          .toLocaleTimeString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          })
      );

      return { ok: true, data: appointments }
    } catch (error) {
      return handleDatabaseError(error)
    }
  };

}

export const appointmentRepository = new AppointmentRepository();