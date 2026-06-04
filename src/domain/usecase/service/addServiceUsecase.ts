import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { storageRepository } from "../../../data/repository/StorageRepository"
import { ServiceError } from "../../../errors/serviceErrors"
import { Result } from "../../../shared/types/result"
import { CreateServiceInput } from "../../models/CreateserviceInput"
import { CreateServiceRequest } from "../../models/CreateServiceRequest"

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

    return serviceRepository.addService(request)
}