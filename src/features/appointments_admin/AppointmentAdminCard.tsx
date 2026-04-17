import { View, Text, TouchableOpacity, Alert } from "react-native"
import { STATUS_STYLES } from "../../constants/statusStyles"
import { Appointment } from "../../domain/models/Appointment"
import { useTheme } from "../../data/provider/ThemeProvider"
import { createAdminAppointmentStyles } from "../../theme/adminAppointmentStyles"
import { Ionicons } from "@expo/vector-icons"
import { useAppointmentAdmin } from "./useAppointmentAdmin"

type Props = {
    appointment: Appointment,
    onCancel: (bookingId: string) => void
}

const handleCancel = (onCancel: (bookingId: string) => void, bookingId: string) => {
  Alert.alert(
    "Cancelar turno",
    "¿Estás seguro de que querés cancelar este turno?",
    [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Cancelar",
        style: "destructive",
        onPress: () => onCancel(bookingId),
      },
    ]
  );
};

export const AppointmentAdminCard: React.FC<Props> = ({
    appointment,
    onCancel
}) => {
    const { id, time, clientName, service, employeeName, status } = appointment
    const statusStyle =
        STATUS_STYLES[status.toLowerCase() as keyof typeof STATUS_STYLES];
    const { isDarkMode } = useTheme();
    const adminAppointmentStyles = createAdminAppointmentStyles(isDarkMode)
    const { cancelAppointment } = useAppointmentAdmin()

    return (
        <View style={adminAppointmentStyles.card}>

            {/* Hora */}
            <View style={adminAppointmentStyles.timeContainer}>
                <Text style={adminAppointmentStyles.time}>{time}</Text>
            </View>

            {/* Información */}
            <View style={adminAppointmentStyles.infoContainer}>
                <Text style={adminAppointmentStyles.client}>{clientName}</Text>
                <Text style={adminAppointmentStyles.service}>{service}</Text>
                <Text style={adminAppointmentStyles.professional}>Con {employeeName}</Text>
            </View>

            {/* Estado */}
            <View style={{ justifyContent: "center"}}>
                <TouchableOpacity onPress={() => handleCancel(onCancel, id)}>
                    <Ionicons name="close-circle-outline" size={40} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};