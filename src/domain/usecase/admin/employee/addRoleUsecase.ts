import { authRepository } from "../../../../data/repository/AuthRepository";
import { employeeRepository } from "../../../../data/repository/EmployeeRepository";
import { userRepository } from "../../../../data/repository/UserRepository";
import { EmployeeError } from "../../../../errors/employeeError";
import { UserError } from "../../../../errors/userError";
import { Result } from "../../../../shared/types/result";
import { Role } from "../../../models/Service";


export const addRoleUsecase = async (
    email: string,
    role: Role
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

    return userRepository.editRoleUser(email, role);
}