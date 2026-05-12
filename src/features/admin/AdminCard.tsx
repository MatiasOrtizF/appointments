import { View, Text } from "react-native"
import { APPOINTMENT_STATUS_STYLES } from "../../constants/statusStyles"
import { Appointment } from "../../domain/models/Appointment"
import { useTheme } from "../../data/provider/ThemeProvider"
import { createAdminAppointmentStyles } from "../../theme/adminAppointmentStyles"

type Props = {
    appointment: Appointment
}

export const AdminCard: React.FC<Props> = ({
    appointment
}) => {
    const { time, clientName, service, employeeName, status } = appointment
    const statusStyle =
        APPOINTMENT_STATUS_STYLES[status.toLowerCase() as keyof typeof APPOINTMENT_STATUS_STYLES];
    const { isDarkMode } = useTheme();
    const adminAppointmentStyles = createAdminAppointmentStyles(isDarkMode)

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
            <View style={adminAppointmentStyles.statusContainer}>
                <View
                    style={[
                        adminAppointmentStyles.statusBadge,
                        { backgroundColor: statusStyle.background }
                    ]}>
                    <Text
                        style={[
                            adminAppointmentStyles.status,
                            { color: statusStyle.text }
                        ]}
                    >
                        {status}
                    </Text>
                </View>
            </View>
        </View>
    );
};