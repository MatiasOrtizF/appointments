import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import LoadingScreen from "../../../src/shared/components/LoadingScreen";
import EditEmployeeScreen from "../../../src/features/main/admin/employee_admin/edit_employee/EditEmployeeScreen";

export default function EditEmployee() {
    const { loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    if (!isAdmin) {
           console.log("no es admin")
        return <Redirect href="/bottom/select-service" />;
    }

    return (
        <EditEmployeeScreen />
    )
}