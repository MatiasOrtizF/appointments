import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { storageRepository } from "../../../data/repository/StorageRepository"
import { ServiceError } from "../../../errors/serviceErrors"
import { Result } from "../../../shared/types/result"

export const deleteServiceUsecase = async (
    serviceId: string,
    imageUrl: string
): Promise<Result<void, ServiceError>> => {

    const deleteImageResult  = await storageRepository.deleteImage(imageUrl)

    if (!deleteImageResult .ok) {
        return { ok: false, error: "unknown" }
    }

    return serviceRepository.deleteService(serviceId)
}