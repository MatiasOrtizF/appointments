import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { storageRepository } from "../../../data/repository/StorageRepository"
import { DatabaseError } from "../../../errors/databaseError"
import { Result } from "../../../shared/types/result"

export const deleteServiceUsecase = async (
    serviceId: string,
    imageUrl: string
): Promise<Result<void, DatabaseError>> => {

    const deleteImageResult  = await storageRepository.deleteImage(imageUrl)

    if (!deleteImageResult .ok) {
        return { ok: false, error: "unknown" }
    }

    return serviceRepository.deleteService(serviceId)
}