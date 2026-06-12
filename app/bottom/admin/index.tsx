import { Redirect } from "expo-router";
import { useAuth } from "../../../src/data/provider/AuthProvider";
import AdminScreen from "../../../src/features/main/admin/AdminScreen";
import LoadingScreen from "../../../src/shared/components/LoadingScreen";

export default function Admin() {
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
        <AdminScreen />
    )
}