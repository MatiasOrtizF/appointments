import { useEffect, useState } from "react"
import { getUserInfoUsecase } from "../../../../domain/usecase/admin/getUserInfoUsecase"
import { authRepository } from "../../../../data/repository/AuthRepository"
import { mapSignOutErrorToMessage } from "../../../../errors/auth/signOutError"
import { Employee } from "../../../../domain/models/Service"
import { mapUserErrorToMessage } from "../../../../errors/userError"
import { EditEmployeeRequest } from "../../../../domain/models/EditEmployeeRequest"
import { editEmployeeUsecase } from "../../../../domain/usecase/admin/employee/editEmployeeUsecase"

export const useEditEmployee = () => {
    const [employeeId, setEmployeeId] = useState<Employee["id"]>("")
    const [image, setImage] = useState<Employee["img"]>("")
    const [name, setName] = useState<Employee["name"]>("")
    const [lastName, setLastName] = useState<Employee["lastName"]>("")
    const [selectedRole, setSelectedRole] = useState<Employee["role"] | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<Employee["status"] | null>(null)

    const [isAdmin, setIsAdmin] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState(false)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getUserInfo()
    }, [])

    const onRefresh = async () => {
        setRefreshing(true);

        await getUserInfo();

        setRefreshing(false);
    };

    const getUserInfo = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await getUserInfoUsecase()

            if (result.ok) {
                const isAdmin = result.data.role === "admin"
                setIsAdmin(isAdmin)
                console.log("?" + isAdmin)
                if (isAdmin) {

                }
            } else {
                logOut()
            }
        } finally {
            setLoading(false)
        }
    }

    const editEmployee = async () => {
        setEditingEmployee(true)
        setError(null)

        if (selectedRole != null && selectedStatus != null && isFormValid()) {
            const employeeInput: EditEmployeeRequest = {
                id: employeeId,
                name: name,
                img: image,
                lastName: lastName,
                role: selectedRole,
                status: selectedStatus
            };
            try {
                const result = await editEmployeeUsecase(employeeInput)

                if (result.ok) {
                    setSuccess(true)
                } else {
                    setError(mapUserErrorToMessage(result.error))
                    setEditingEmployee(false)
                }
            } finally {
                setEditingEmployee(false)
            }
        } else {
            setError("debes completar todos los campos")
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
            selectedRole != null &&
            selectedStatus != null
        );
    };

    return {
        employeeId, setEmployeeId,
        image, setImage,
        name, setName,
        lastName, setLastName,
        selectedRole, setSelectedRole,
        selectedStatus, setSelectedStatus,
        editingEmployee,
        loading,
        success,
        error,
        refreshing,
        onRefresh,
        editEmployee
    }
}