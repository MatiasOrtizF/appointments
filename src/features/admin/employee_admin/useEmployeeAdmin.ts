import { useEffect, useState } from "react"
import { Employee } from "../../../domain/models/Service"
import { getUserInfoUsecase } from "../../../domain/usecase/admin/getUserInfoUsecase"
import { authRepository } from "../../../data/repository/AuthRepository"
import { mapSignOutErrorToMessage } from "../../../errors/auth/signOutError"
import { getEmployeesUsecase } from "../../../domain/usecase/admin/employee/getEmployeesUsecase"
import { mapUserErrorToMessage } from "../../../errors/userError"
import { deleteEmployeeUsecase } from "../../../domain/usecase/admin/employee/deleteEmployeeUsecase"

export const useEmployeeAdmin = () => {
    const [employees, setEmployees] = useState<Employee[] | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
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
                    await fetchEmployee()
                }
            } else {
                logOut()
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchEmployee = async () => {
        try {
            const result = await getEmployeesUsecase()

            if (result.ok) {
                setEmployees(result.data)
            } else {
                setError(mapUserErrorToMessage(result.error))
            }

        } finally {
            setLoading(false)
        }
    }

    const deleteEmployee = async (employeeId: string) => {
        try {
            const result = await deleteEmployeeUsecase(employeeId)

            if (result.ok) {
                setEmployees(prev =>
                    prev?.filter(service => service.id !== employeeId) ?? null
                )
                setSuccess(true)
            } else {
                setError(mapUserErrorToMessage(result.error))
            }

        } finally {
            setLoading(false)
        }
    }

    const logOut = async () => {
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

    return {
        employees,
        loading,
        success,
        error,
        refreshing,
        onRefresh,
        deleteEmployee
    }
}