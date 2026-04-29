import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import LoadingScreen from "../../../src/shared/LoadingScreen";
import EditServiceScreen from "../../../src/features/admin/serviceAdmin/editService/EditServiceScreen";

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
        <EditServiceScreen />
    )
}