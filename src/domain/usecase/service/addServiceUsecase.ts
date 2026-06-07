import { serviceEmployeeRepository } from "../../../data/repository/ServiceEmployeeRepository"
import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { storageRepository } from "../../../data/repository/StorageRepository"
import { ServiceError } from "../../../errors/serviceErrors"
import { Result } from "../../../shared/types/result"
import { CreateServiceInput } from "../../models/service/CreateServiceInput"
import { CreateServiceRequest } from "../../models/service/CreateServiceRequest"

export const addServiceUsecase = async (
    input: CreateServiceInput
): Promise<Result<void, ServiceError>> => {

    const resultImageUrl = await storageRepository.uploadImage(input.img, "servicios")

    if (!resultImageUrl.ok) {
        return { ok: false, error: "unknown" }
    }

    const request: CreateServiceRequest = {
        ...input,
        imgUrl: resultImageUrl.data
    };

    const serviceResult = await serviceRepository.addService(request)

    if (!serviceResult.ok) {
        return serviceResult
    }

    const serviceId = serviceResult.data

    const addEmployeesResult =
        await serviceEmployeeRepository.addEmployeeToService(
            serviceId,
            input.employees
        )

    if (!addEmployeesResult.ok) {
        return { ok: false, error: "unknown" }
    }

    return {
        ok: true,
        data: undefined
    }
}