import { FlatList, ListRenderItem, RefreshControl, Text, View } from "react-native";
import { useAppointmentAdmin } from "./useAppointmentAdmin";
import LoadingScreen from "../../shared/LoadingScreen";
import { useTheme } from "../../data/provider/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { darkColors, lightColors } from "../../theme/colors";
import { Appointment } from "../../domain/models/Appointment";
import { AppointmentAdminCard } from "./AppointmentAdminCard";

export default function AppointmentAdminScreen() {
    const { adminAppointments, isAdmin, loading, refreshing, onRefresh } = useAppointmentAdmin()
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors

    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    if (!isAdmin && !loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <Text style={{ color: colors.textPrimary, textAlign: "center" }}>Solamente los admins pueden acceder a esta informacion</Text>
            </View>
        )
    }

    const renderItem: ListRenderItem<Appointment> = ({ item }) => (
        <AppointmentAdminCard
            appointment={item}
            onCancel={() => { }}
        />
    );

    const renderEmpty = () => {
        if (adminAppointments != null) {
            return (
                <View style={{ alignItems: "center", marginTop: 40 }}>
                    <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
                        No hay tunos el dia de hoy
                    </Text>
                </View>
            )
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} >
            <FlatList<Appointment>
                data={adminAppointments}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24 }}

                ListEmptyComponent={renderEmpty}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    )
}