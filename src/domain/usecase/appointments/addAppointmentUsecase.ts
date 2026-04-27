import { Timestamp } from "firebase/firestore"
import { appointmentRepository } from "../../../data/repository/AppointmentRepository"
import { authRepository } from "../../../data/repository/AuthRepository"
import { AppointmentError } from "../../../errors/appointmentErrors"
import { Result } from "../../../shared/types/result"
import { CreateAppointmentInput } from "../../models/CreateAppointmentInput"
import { CreateAppointmentRequest } from "../../models/CreateAppointmentRequest"

export const addAppointmentUsecase = async (
    input: CreateAppointmentInput
): Promise<Result<void, AppointmentError>> => {

    const user = await authRepository.getCurrentUser()

    if (!user) {
        return { ok: false, error: "unauthenticated" }
    }

    const request: CreateAppointmentRequest = {
        ...input,
        uid: user.uid,
        dateTime: Timestamp.fromDate(new Date(input.dateTime))
    };

    return appointmentRepository.addAppointment(request)
}