import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import LoadingScreen from "../../../src/shared/components/LoadingScreen";
import EmployeeAdminScreen from "../../../src/features/main/admin/employee_admin/EmployeeAdminScreen";

export default function EmployeeAdmin() {
    const { loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <LoadingScreen />
        );
    }

    if (!isAdmin) {
        return <Redirect href="/bottom/select-service" />;
    }

    return (
        <EmployeeAdminScreen />
    )
}