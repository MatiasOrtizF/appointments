import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import LoadingScreen from "../../../src/shared/LoadingScreen";
import ServiceAdminScreen from "../../../src/features/admin/serviceAdmin/ServiceAdminScreen";

export default function ServiceAdmin() {
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
        <ServiceAdminScreen />
    )
}