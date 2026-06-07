import { View, Text } from "react-native"
import { APPOINTMENT_STATUS_STYLES } from "../../../constants/statusStyles"
import { Appointment } from "../../../domain/models/appointments/Appointment"
import { useTheme } from "../../../data/provider/ThemeProvider"
import { createAdminAppointmentStyles } from "../../../theme/adminAppointmentStyles"
import { use } from "react"
import { formatAppointmentTimeAdmin } from "../../../utils/formatAppointmentTimeAdmin"
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter"

type Props = {
    appointment: Appointment
}

export const AdminCard: React.FC<Props> = ({
    appointment
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
                <Text style={adminAppointmentStyles.professional}>Con {capitalizeFirstLetter(employee.name)}</Text>
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