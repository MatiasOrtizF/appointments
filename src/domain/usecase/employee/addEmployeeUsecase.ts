import { employeeRepository } from "../../../data/repository/EmployeeRepository"
import { storageRepository } from "../../../data/repository/StorageRepository"
import { EmployeeError } from "../../../errors/employeeError"
import { Result } from "../../../shared/types/result"
import { CreateEmployeeInput } from "../../models/employee/CreateEmployeeInput"
import { CreateEmployeeRequest } from "../../models/employee/CreateEmployeeRequest"

export const addEmployeeUsecase = async (
    input: CreateEmployeeInput
): Promise<Result<void, EmployeeError>> => {

    const resultImageUrl = await storageRepository.uploadImage(input.image, "empleados")

    if (!resultImageUrl.ok) {
        return { ok: false, error: "unknown" }
    }

    const request: CreateEmployeeRequest = {
        ...input,
        imageUrl: resultImageUrl.data
    };

    return employeeRepository.addEmployee(request)
}