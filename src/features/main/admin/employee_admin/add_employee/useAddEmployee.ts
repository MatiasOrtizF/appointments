import { useState } from "react"
import { mapSignOutErrorToMessage } from "../../../../../errors/auth/signOutError"
import { authRepository } from "../../../../../data/repository/AuthRepository"
import { Employee, employeeStatuses, Role, } from "../../../../../domain/models/service/Service"
import { addEmployeeUsecase } from "../../../../../domain/usecase/employee/addEmployeeUsecase"
import { mapEmployeeErrorToMessage } from "../../../../../errors/employeeError"
import { CreateEmployeeInput } from "../../../../../domain/models/employee/CreateEmployeeInput"

export const useAddEmployee = () => {
    const [image, setImage] = useState<Employee["img"]>("")
    const [name, setName] = useState<Employee["name"]>("")
    const [lastName, setLastName] = useState<Employee["lastName"]>("")
    const [selectedStatus, setSelectedStatus] = useState<Employee["status"] | null>(employeeStatuses.ACTIVE)
    const [addingEmployee, setAddingEmployee] = useState(false)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [errorForm, setErrorForm] = useState<string | null>(null);

    const addEmployee = async () => {
        setAddingEmployee(true)
        setError(null)

        if (selectedStatus == null || !isFormValid()) {
            setAddingEmployee(false)
            return
        }

        const employeeInput: CreateEmployeeInput = {
            image: image,
            name: name,
            lastName: lastName,
            status: selectedStatus
        };

        try {
            const result = await addEmployeeUsecase(employeeInput)
            if (result.ok) {
                setSuccess(true)
            } else {
                setError(mapEmployeeErrorToMessage(result.error))
            }
        } finally {
            setAddingEmployee(false)
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
        const trimmedImage = image.trim()
        const trimmedName = name.trim()
        const trimmedLastName = lastName.trim()

        if (!trimmedImage) {
            setErrorForm("Por favor agrega una imagen")
            return false
        }

        if (!trimmedName) {
            setErrorForm("Por favor agrega un nombre")
            return false
        }

        if (!trimmedLastName) {
            setErrorForm("Por favor agrega un apellido")
            return false
        }

        if (!selectedStatus) {
            setErrorForm("Por favor selecciona un estado")
            return false
        }

        setErrorForm(null)
        return true
    };

    return {
        image, setImage,
        name, setName,
        lastName, setLastName,
        selectedStatus, setSelectedStatus,
        addingEmployee, setAddingEmployee,
        loading,
        success,
        error,
        errorForm,
        isFormValid,
        addEmployee
    }
}