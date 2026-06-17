import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import LoadingScreen from "../../../src/shared/components/LoadingScreen";
import InfoAdminScreen from "../../../src/features/main/admin/info_admin/InfoAdminScreen";

export default function EditService() {
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
        <InfoAdminScreen />
    )
}