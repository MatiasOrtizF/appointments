import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import LoadingScreen from "../../../src/shared/LoadingScreen";
import AddEmployeeScreen from "../../../src/features/main/admin/employee_admin/add_employee/AddEmployeeScreen";

export default function AddEmployee() {
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
        <AddEmployeeScreen />
    )
}