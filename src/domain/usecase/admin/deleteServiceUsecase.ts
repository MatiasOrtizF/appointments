import { authRepository } from "../../../data/repository/AuthRepository"
import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { userRepository } from "../../../data/repository/UserRepository"
import { ServiceError } from "../../../errors/serviceErrors"
import { Result } from "../../../shared/types/result"

export const deleteServiceUsecase = async (
    id: string
): Promise<Result<void, ServiceError>> => {

    const currentUser = await authRepository.getCurrentUser()

    if (!currentUser) {
        return { ok: false, error: "unauthenticated" };
    }

    const userResult = await userRepository.getUser(currentUser.uid);

    if (!userResult.ok) {
        return { ok: false, error: "unauthenticated" };
    }

    if (userResult.data.role !== "admin") {
        return { ok: false, error: "permission" };
    }

    return serviceRepository.deleteService(id);
}