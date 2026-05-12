import { authRepository } from "../../../../data/repository/AuthRepository";
import { employeeRepository } from "../../../../data/repository/EmployeeRepository";
import { userRepository } from "../../../../data/repository/UserRepository";
import { EmployeeError } from "../../../../errors/employeeError";
import { Result } from "../../../../shared/types/result";


export const deleteEmployeeUsecase = async (
    id: string
): Promise<Result<void, EmployeeError>> => {

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

    return employeeRepository.deleteEmployee(id);
}