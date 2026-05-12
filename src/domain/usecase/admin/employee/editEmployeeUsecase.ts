import { authRepository } from "../../../../data/repository/AuthRepository";
import { userRepository } from "../../../../data/repository/UserRepository";
import { UserError } from "../../../../errors/userError";
import { Result } from "../../../../shared/types/result";
import { EditEmployeeRequest } from "../../../models/EditEmployeeRequest";


export const editEmployeeUsecase = async (
    employee: EditEmployeeRequest
): Promise<Result<void, UserError>> => {

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

    return userRepository.editEmployee(employee);
}