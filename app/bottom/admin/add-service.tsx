import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import LoadingScreen from "../../../src/shared/components/LoadingScreen";
import AddServiceScreen from "../../../src/features/main/admin/service_admin/add_service/AddServiceScreen";

export default function EditService() {
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
        <AddServiceScreen />
    )
}