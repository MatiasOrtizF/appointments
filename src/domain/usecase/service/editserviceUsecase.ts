import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { storageRepository } from "../../../data/repository/StorageRepository"
import { ServiceError } from "../../../errors/serviceErrors"
import { Result } from "../../../shared/types/result"
import { EditServiceInput } from "../../models/service/EditServiceInput"

export const editServiceUsecase = async (
    input: EditServiceInput
): Promise<Result<void, ServiceError>> => {
    let imageUrl = input.oldImageUrl

    if(input.imageChanged) {
        const uploadResult = await storageRepository.uploadImage(
            input.newImage,
            "servicios"
        )

        if(!uploadResult.ok) {
            return { ok: false, error: "unknown" }
        }

        imageUrl = uploadResult.data
    }

    const updateResult = await serviceRepository.editService({
        ...input,
        newImage: imageUrl
    })

    if (!updateResult.ok) {
        return updateResult
    }

    if (input.imageChanged) {
        await storageRepository.deleteImage(input.oldImageUrl)
    }

    return updateResult
}