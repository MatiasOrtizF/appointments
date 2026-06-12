import { appointmentRepository } from "../../../data/repository/AppointmentRepository"
import { authRepository } from "../../../data/repository/AuthRepository"
import { AddAppointmentError } from "../../../errors/addAppointmentErrors"
import { Result } from "../../../shared/types/result"
import { CreateAppointmentInput } from "../../models/appointments/CreateAppointmentInput"
import { CreateAppointmentRequest } from "../../models/appointments/CreateAppointmentRequest"

export const addAppointmentUsecase = async (
    input: CreateAppointmentInput
): Promise<Result<void, AddAppointmentError>> => {

    const user = await authRepository.getCurrentUser()

    if (!user) {
        return { ok: false, error: "unauthenticated" }
    }

    const request: CreateAppointmentRequest = {
        userId: user.id,
        employeeId: input.employeeId,
        serviceId: input.serviceId,
        appointmentAt: input.date + "T" + input.time + ":00-03:00"
    };

    return appointmentRepository.addAppointment(request)
}