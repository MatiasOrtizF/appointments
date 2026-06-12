import { FlatList, ListRenderItem, RefreshControl, Text, View } from "react-native";
import { useAppointmentAdmin } from "./useAppointmentAdmin";
import LoadingScreen from "../../../../shared/components/LoadingScreen";
import { useTheme } from "../../../../data/provider/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { darkColors, lightColors } from "../../../../theme/colors";
import { Appointment } from "../../../../domain/models/appointments/Appointment";
import { AppointmentAdminCard } from "./AppointmentAdminCard";
import { useEffect } from "react";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

export default function AppointmentAdminScreen() {
    const { adminAppointments, loading, error, success, refreshing, onRefresh, cancelAppointment } = useAppointmentAdmin()
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors

    useEffect(() => {
        if (error) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: error,
                button: "Cerrar",
                closeOnOverlayTap: false,
            });
        }

        if (success) {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Turno cancelado con exito!',
            })
        }
    }, [error, success])

    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    /*if (!isAdmin && !loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <Text style={{ color: colors.textPrimary, textAlign: "center" }}>Solamente los admins pueden acceder a esta informacion</Text>
            </View>
        )
    }*/

    const renderItem: ListRenderItem<Appointment> = ({ item }) => (
        <AppointmentAdminCard
            appointment={item}
            onCancel={cancelAppointment}
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