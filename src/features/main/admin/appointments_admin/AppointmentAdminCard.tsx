import { View, Text, TouchableOpacity, Alert } from "react-native"
import { APPOINTMENT_STATUS_STYLES } from "../../../../constants/statusStyles"
import { Appointment } from "../../../../domain/models/Appointment"
import { useTheme } from "../../../../data/provider/ThemeProvider"
import { createAdminAppointmentStyles } from "../../../../theme/adminAppointmentStyles"
import { Ionicons } from "@expo/vector-icons"
import { useAppointmentAdmin } from "./useAppointmentAdmin"
import { formatAppointmentDate } from "../../../../utils/formatAppointmentDate"
import { formatAppointmentTimeAdmin } from "../../../../utils/formatAppointmentTimeAdmin"

type Props = {
    appointment: Appointment,
    onCancel: (appointmentId: string) => void
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
    const { id, employee, service, user, appointmentAt, status } = appointment
    const statusStyle =
        APPOINTMENT_STATUS_STYLES[status.toLowerCase() as keyof typeof APPOINTMENT_STATUS_STYLES];
    const { isDarkMode } = useTheme();
    const adminAppointmentStyles = createAdminAppointmentStyles(isDarkMode)

    return (
        <View style={[adminAppointmentStyles.card, { marginVertical: 10 }]}>

            {/* Hora */}
            <View style={adminAppointmentStyles.timeContainer}>
                <Text style={adminAppointmentStyles.time}>{formatAppointmentTimeAdmin(appointmentAt)}</Text>
            </View>

            {/* Información */}
            <View style={adminAppointmentStyles.infoContainer}>
                <Text style={adminAppointmentStyles.client}>{user.name} {user.lastName}</Text>
                <Text style={adminAppointmentStyles.service}>{service.name}</Text>
                <Text style={adminAppointmentStyles.professional}>Con {employee.name} {employee.lastName}</Text>
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