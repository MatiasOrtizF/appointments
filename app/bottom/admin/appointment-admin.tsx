import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import AppointmentAdminScreen from "../../../src/features/appointments_admin/AppointmentAdminScreen";
import LoadingScreen from "../../../src/shared/LoadingScreen";

export default function AppointmentAdmin() {
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
        <AppointmentAdminScreen />
    )
}