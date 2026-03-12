import { View, Text, StyleSheet } from "react-native"
import { STATUS_STYLES } from "../../constants/statusStyles"
import { Appointment } from "../../domain/models/Appointment"

type Props = {
    appointment: Appointment
    onCancel: (bookingId: string) => void
}

export const AdminCard: React.FC<Props> = ({
    appointment,
    onCancel
}) => {
    const { time, clientName, service, employeeName, status } = appointment
    const statusStyle =
        STATUS_STYLES[status.toLowerCase() as keyof typeof STATUS_STYLES];

    return (
        <View style={styles.card}>

            {/* Hora */}
            <View style={styles.timeContainer}>
                <Text style={styles.time}>{time}</Text>
            </View>

            {/* Información */}
            <View style={styles.infoContainer}>
                <Text style={styles.client}>{clientName}</Text>
                <Text style={styles.service}>{service}</Text>
                <Text style={styles.professional}>Con {employeeName}</Text>
            </View>

            {/* Estado */}
            <View style={styles.statusContainer}>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: statusStyle.background }
                    ]}>
                    <Text
                        style={[
                            styles.status,
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

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        elevation: 3, // android
        shadowColor: "#000", // ios
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },

    timeContainer: {
        justifyContent: "center",
        marginRight: 16,
    },

    time: {
        fontSize: 18,
        fontWeight: "bold",
    },

    infoContainer: {
        flex: 1,
        justifyContent: "space-between",
    },

    client: {
        fontSize: 16,
        fontWeight: "600",
    },

    service: {
        fontSize: 14,
        color: "#555",
        textTransform: "capitalize",
        marginVertical: 2
    },

    professional: {
        fontSize: 12,
        color: "#888",
    },

    statusContainer: {
        justifyContent: "flex-start",
        alignItems: "flex-end",
    },

    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 50,
    },

    status: {
        fontWeight: "600",
        textTransform: "capitalize"
    },
});