import { useEffect, useState } from "react"
import { Employee } from "../../../../domain/models/service/Service"
import { getUserInfoUsecase } from "../../../../domain/usecase/admin/getUserInfoUsecase"
import { authRepository } from "../../../../data/repository/AuthRepository"
import { mapSignOutErrorToMessage } from "../../../../errors/auth/signOutError"
import { getEmployeesUsecase } from "../../../../domain/usecase/admin/employee/getEmployeesUsecase"
import { mapUserErrorToMessage } from "../../../../errors/userError"
import { deleteEmployeeUsecase } from "../../../../domain/usecase/admin/employee/deleteEmployeeUsecase"
import { employeeRepository } from "../../../../data/repository/EmployeeRepository"
import { mapEmployeeErrorToMessage } from "../../../../errors/employeeError"

export const useEmployeeAdmin = () => {
    const [employees, setEmployees] = useState<Employee[] | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchEmployee()
    }, [])

    const onRefresh = async () => {
        setRefreshing(true);

        await fetchEmployee();

        setRefreshing(false);
    };

    const fetchEmployee = async () => {
        try {
            const result = await employeeRepository.getEmployees()

            if (result.ok) {
                setEmployees(result.data)
            } else {
                setError(mapEmployeeErrorToMessage(result.error))
            }

        } finally {
            setLoading(false)
        }
    }

    const deleteEmployee = async (employeeId: number) => {
        try {
            const result = await employeeRepository.deleteEmployee(employeeId)

            if (result.ok) {
                setEmployees(prev =>
                    prev?.filter(employee => employee.id !== employeeId) ?? null
                )
                setSuccess(true)
            } else {
                setError(mapEmployeeErrorToMessage(result.error))
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