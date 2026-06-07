import { useState } from "react"
import { authRepository } from "../../../../../data/repository/AuthRepository"
import { mapSignOutErrorToMessage } from "../../../../../errors/auth/signOutError"
import { Employee } from "../../../../../domain/models/service/Service"
import { editEmployeeUsecase } from "../../../../../domain/usecase/employee/editEmployeeUsecase"
import { EditEmployeeInput } from "../../../../../domain/models/employee/EditEmployeeInput"
import { mapEmployeeErrorToMessage } from "../../../../../errors/employeeError"

export const useEditEmployee = () => {
    const [employeeId, setEmployeeId] = useState<Employee["id"]>(0)
    const [image, setImage] = useState<Employee["img"]>("")
    const [newImage, setNewImage] = useState<string>("")
    const [name, setName] = useState<Employee["name"]>("")
    const [initialName, setInitialName] = useState<Employee["name"]>("")
    const [lastName, setLastName] = useState<Employee["lastName"]>("")
    const [initialLastName, setInitialLastName] = useState<Employee["lastName"]>("")
    const [selectedStatus, setSelectedStatus] = useState<Employee["status"] | null>(null)
    const [initialSelectedStatus, setInitialSelectedStatus] = useState<Employee["status"] | null>(null)
    const [editingEmployee, setEditingEmployee] = useState(false)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    const editEmployee = async () => {
        setEditingEmployee(true)
        setError(null)

        if (isChanged()) {
            if (selectedStatus != null && isFormValid()) {
                console.log("primera opcion ", newImage.trim().length > 0, "segunda opcion ", newImage.trim())
                const employeeInput: EditEmployeeInput = {
                    id: employeeId,
                    name: name,
                    lastName: lastName,
                    status: selectedStatus,
                    newImage: newImage,
                    oldImageUrl: image,
                    imageChanged: newImage.trim().length > 0
                };
                try {
                    const result = await editEmployeeUsecase(employeeInput)

                    if (result.ok) {
                        setSuccess(true)
                    } else {
                        setError(mapEmployeeErrorToMessage(result.error))
                        setEditingEmployee(false)
                    }
                } finally {
                    setEditingEmployee(false)
                }
            } else {
                setError("Debes completar todos los campos")
                setEditingEmployee(false)
            }
        } else {
            setError("Debes realizar almenos un cambio")
            setEditingEmployee(false)
        }
    }

    const logOut = async () => {
        console.log("llamamos al log out")
        setLoading(true);
        setError(null);

        try {
            const result = await authRepository.signOut()
            console.log("salio bien? " + result.ok)
            if (!result.ok) {
                setError(mapSignOutErrorToMessage(result.error))
            }

        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return (
            image.trim() !== "" &&
            name.trim() !== "" &&
            lastName.trim() !== "" &&
            selectedStatus != null
        );
    };

    const isChanged = () => {
        return (
            newImage.trim().length > 0 ||
            name != initialName ||
            lastName != initialLastName ||
            selectedStatus != initialSelectedStatus
        )
    }

    return {
        employeeId, setEmployeeId,
        image, setImage,
        newImage, setNewImage,
        name, setName,
        setInitialName,
        lastName, setLastName,
        setInitialLastName,
        selectedStatus, setSelectedStatus,
        setInitialSelectedStatus,
        editingEmployee,
        loading,
        success,
        error,
        editEmployee
    }
}