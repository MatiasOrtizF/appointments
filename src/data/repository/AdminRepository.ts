import { Appointment } from '../../domain/models/appointments/Appointment'
import { appointmentToDomain } from '../remote/response/AppointmentResponse';
import { Result } from '../../shared/types/result';
import { supabase } from '../../config/Supabase';
import { employeeToDomain } from '../remote/response/EmployeeResponse';
import { serviceToDomain } from '../remote/response/ServiceResponse';
import { authUserToDomain } from '../remote/response/AuthUserResponse';
import { DatabaseError, handleDatabaseError } from '../../errors/databaseError';

const TABLE_TURNOS = "turnos"

export class AdminRepository {
  async getUpcomingTodayAppointments(): Promise<Result<Appointment[], DatabaseError>> {
    try {

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
        handleDatabaseError(error)
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
      return handleDatabaseError(error)
    }
  };

  async getAdminAppointments(): Promise<Result<Appointment[], DatabaseError>> {
     try {

      const { now, startOfTomorrow } = getTodayRange()

      const { data, error } = await supabase
        .from(TABLE_TURNOS)
        .select(`
          *,
          empleados (*),
          servicios (*),
          usuarios(*)
        `)
        .gt("appointment_at", now.toISOString())
        .order("appointment_at", { ascending: true })
        .limit(10)

      if (error) {
            return handleDatabaseError(error)
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
      return handleDatabaseError(error)
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

export const adminRepository = new AdminRepository();