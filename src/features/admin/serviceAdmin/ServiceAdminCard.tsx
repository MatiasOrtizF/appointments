import { View, Text, Image, StyleSheet, Alert } from "react-native"
import { Service } from "../../../domain/models/Service";
import { useTheme } from "../../../data/provider/ThemeProvider";
import { createAdminAppointmentStyles } from "../../../theme/adminAppointmentStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { darkColors, lightColors } from "../../../theme/colors";
import { createGlobalStyles } from "../../../theme/globalStyles";

type Props = {
    service: Service,
    onDelete: (serviceId: string) => void
}

export const ServiceAdminCard: React.FC<Props> = ({
    service,
    onDelete
}) => {
    const { id, img, name, description, duration_min, price, employees } = service
    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors
    const adminAppointmentStyles = createAdminAppointmentStyles(isDarkMode)

    const handleDeleteService = () => {
        Alert.alert(
            "Borrar servicio",
            "¿Estás seguro de que querés borrar este servicio?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Borrar",
                    style: "destructive",
                    onPress: () => onDelete(id),
                },
            ]
        );
    };

    return (
        <View style={[adminAppointmentStyles.card, { gap: 10 }]}>

            {/* Imagen */}
            <View style={{ justifyContent: "center" }}>
                <Image source={{ uri: img }} style={{ width: 75, height: 75, borderRadius: 50 }} />
            </View>

            {/* Información */}
            <View style={[adminAppointmentStyles.infoContainer, { gap: 5 }]}>
                <Text style={adminAppointmentStyles.client}>{name}</Text>
                <Text numberOfLines={3} style={adminAppointmentStyles.service}>{description}</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                        <Text style={adminAppointmentStyles.professional}>{" " + duration_min}</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Ionicons name="cash-outline" size={16} color={colors.primary} />
                        <Text style={adminAppointmentStyles.professional}>{" $" + price}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", gap: 7 }}>
                    {employees.map((employee) => (
                        <Image source={{ uri: employee.img }} style={styles.imageEmployee} />
                    ))}
                </View>
            </View>

            {/* Estado */}
            <View style={[adminAppointmentStyles.statusContainer, { gap: 25 }]}>
                <Ionicons name="pencil-outline" size={25} color={colors.textSecondary} onPress={() => router.push("/bottom/admin/edit-service")} />
                <Ionicons name="trash-outline" size={25} color={colors.textSecondary} onPress={() => handleDeleteService()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageEmployee: {
        borderRadius: 50,
        width: 35,
        height: 35
    },
})