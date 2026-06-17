import { Appointment } from '../../domain/models/appointments/Appointment'
import { appointmentToDomain } from '../remote/response/AppointmentResponse';
import { Result } from '../../shared/types/result';
import { supabase } from '../../config/Supabase';
import { employeeToDomain } from '../remote/response/EmployeeResponse';
import { serviceToDomain } from '../remote/response/ServiceResponse';
import { authUserToDomain } from '../remote/response/AuthUserResponse';
import { DatabaseError, handleDatabaseError } from '../../errors/databaseError';
import { BusinessInfo } from '../../domain/models/business_info/BusinessInfo';
import { businessInfoToDomain } from '../remote/response/BusinessInfoResponse';
import { CreateBusinessInfo } from '../../domain/models/business_info/CreateBusinessInfo';

const TABLE_TURNOS = "turnos"
const TABLE_BUSINESS_INFO = "business_info"
const TABLE_BUSINESS_HOURS = "business_hours"

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

  async getBusinessInfo(): Promise<Result<BusinessInfo, DatabaseError>> {
    try {

      const { data, error } = await supabase
        .from(TABLE_BUSINESS_INFO)
        .select(`
        business_id,
        payment_methods,
        cancellation_policy,
        chatbot_context,
        business_hours (
          day_of_week,
          open_time,
          close_time
        )
      `)
        .single()

      if (error) {
        return handleDatabaseError(error)
      }

      const businessInfo = businessInfoToDomain(data)

      return {
        ok: true,
        data: businessInfo
      }

    } catch (error) {
      return handleDatabaseError(error)
    }
  }

  async saveBusinessInfo(
    request: CreateBusinessInfo
  ): Promise<Result<void, DatabaseError>> {

    try {

      let businessId = request.id;

      if (!businessId) {
      
        const { data, error } = await supabase
          .from(TABLE_BUSINESS_INFO)
          .insert({
            payment_methods: request.paymentMethods,
            cancellation_policy: request.cancellationPolicy,
            chatbot_context: request.chatbotContext,
          })
          .select("business_id")
          .single();

        if (error) {
          return handleDatabaseError(error);
        }

        businessId = data.business_id;

      } else {

        const { error } = await supabase
          .from(TABLE_BUSINESS_INFO)
          .update({
            payment_methods: request.paymentMethods,
            cancellation_policy: request.cancellationPolicy,
            chatbot_context: request.chatbotContext,
          })
          .eq("business_id", businessId);

        if (error) {
          return handleDatabaseError(error);
        }
      }

      const { error: deleteError } = await supabase
        .from(TABLE_BUSINESS_HOURS)
        .delete()
        .eq("business_id", businessId);

      if (deleteError) {
        return handleDatabaseError(deleteError);
      }

      const hours = request.businessHours.map(hour => ({
        business_id: businessId,
        day_of_week: hour.dayOfWeek,
        open_time: hour.openTime,
        close_time: hour.closeTime,
      }));

      const { error: insertHoursError } = await supabase
        .from(TABLE_BUSINESS_HOURS)
        .insert(hours);

      if (insertHoursError) {
        return handleDatabaseError(insertHoursError);
      }

      return {
        ok: true,
        data: undefined,
      };

    } catch (error) {
      return handleDatabaseError(error);
    }
  }
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