import { View, Image, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Appointment } from "../../domain/models/Appointment"
import { Ionicons } from "@expo/vector-icons";
import { APPOINTMENT_STATUS_STYLES } from "../../constants/statusStyles";
import { useTheme } from "../../data/provider/ThemeProvider";
import { darkColors, lightColors } from "../../theme/colors";
import { useBooking } from "./useBooking";
import { formatAppointmentDate } from "../../utils/formatAppointmentDate";
import { useEffect } from "react";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";

type Props = {
    appointment: Appointment,
    onCancel: (appointmentId: string) => void;
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

export const UpcomingBookingCard = ({ appointment, onCancel }: Props) => {
    const { id, employee, service, appointmentAt, status } = appointment
    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;
    const statusStyle =
        APPOINTMENT_STATUS_STYLES[status.toLowerCase() as keyof typeof APPOINTMENT_STATUS_STYLES];
        
    return (
        <View style={styles.card}>

            {/* IMAGE */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: service.img }} style={styles.image} />

                <View
                    style={[
                        styles.status,
                        { backgroundColor: statusStyle.background }
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            { color: statusStyle.text }
                        ]}
                    >
                        {status}
                    </Text>
                </View>

                <View style={styles.imageBottom}>
                    <Text style={styles.service}>{service.name}</Text>
                    <Text style={styles.employee}>con {employee.name}</Text>
                </View>
            </View>


            {/* INFO ROW */}
            <View style={[styles.infoRow, { backgroundColor: colors.bgCard }]}>

                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />

                    <View>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Date & Time</Text>
                        <Text style={[styles.date, { color: colors.textPrimary }]}>{formatAppointmentDate(appointment.appointmentAt)}</Text>
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Price</Text>
                    <Text style={[styles.price, { color: colors.textPrimary }]}>${service.price}</Text>
                </View>

            </View>

            {/* DIVIDER */}
            <View style={{ height: 1, backgroundColor: colors.divider }} />

            {/* CANCEL BUTTON */}
            <Pressable style={[styles.cancelButton, { backgroundColor: colors.bgCard }]} onPress={() => handleCancel(onCancel, id)}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 20,
        elevation: 3
    },

    imageContainer: {
        height: 160,
        position: "relative"
    },

    image: {
        width: "100%",
        height: "100%"
    },

    status: {
        position: "absolute",
        top: 10,
        left: 10,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 50,
    },

    statusText: {
        fontWeight: "600",
        textTransform: "uppercase",
    },

    imageBottom: {
        position: "absolute",
        bottom: 10,
        left: 10
    },

    service: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        textTransform: "capitalize"
    },

    employee: {
        color: "white",
        fontSize: 13
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        alignItems: "center"
    },

    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },

    label: {
        fontSize: 11,
    },

    date: {
        fontSize: 14,
        fontWeight: "500"
    },

    priceContainer: {
        alignItems: "flex-end"
    },

    price: {
        fontSize: 16,
        fontWeight: "600"
    },

    cancelButton: {
        paddingVertical: 12,
        alignItems: "center"
    },

    cancelText: {
        color: "#ff4d4d",
        fontWeight: "600",
        fontSize: 15
    }

});