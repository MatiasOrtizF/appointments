import { employeeRepository } from "../../../data/repository/EmployeeRepository"
import { storageRepository } from "../../../data/repository/StorageRepository"
import { DatabaseError } from "../../../errors/databaseError"
import { Result } from "../../../shared/types/result"
import { EditEmployeeInput } from "../../models/employee/EditEmployeeInput"

export const editEmployeeUsecase = async (
    input: EditEmployeeInput
): Promise<Result<void, DatabaseError>> => {
    let imageUrl = input.oldImageUrl

    if(input.imageChanged) {
        const uploadResult = await storageRepository.uploadImage(
            input.newImage,
            "empleados"
        )

        if(!uploadResult.ok) {
            return { ok: false, error: "unknown" }
        }

        imageUrl = uploadResult.data
        console.log("url de la imagen", imageUrl)
    }

    const updateResult = await employeeRepository.editEmployee({
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