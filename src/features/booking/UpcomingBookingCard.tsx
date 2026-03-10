import { View, Image, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Appointment } from "../../domain/models/Appointment"
import { Ionicons } from "@expo/vector-icons";
import { STATUS_STYLES } from "../../constants/statusStyles";

type Props = {
    appointment: Appointment
    onCancel: (bookingId: string) => void
}

export const UpcomingBookingCard: React.FC<Props> = ({
    appointment,
    onCancel
}) => {
    const { id, serviceImg, status, service, date, time, price, employeeName } = appointment
    const statusStyle =
        STATUS_STYLES[status.toLowerCase() as keyof typeof STATUS_STYLES];

    return (
        <View style={styles.card}>

            {/* IMAGE */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: serviceImg }} style={styles.image} />

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
                    <Text style={styles.service}>{service}</Text>
                    <Text style={styles.employee}>con {employeeName}</Text>
                </View>
            </View>


            {/* INFO ROW */}
            <View style={styles.infoRow}>

                <View style={styles.dateContainer}>
                    <Ionicons name="calendar-outline" size={18} color="#555" />

                    <View>
                        <Text style={styles.label}>Date & Time</Text>
                        <Text style={styles.date}>{date} {time}</Text>
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.label}>Price</Text>
                    <Text style={styles.price}>${price}</Text>
                </View>

            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* CANCEL BUTTON */}
            <Pressable style={styles.cancelButton} onPress={() => onCancel(id)}>
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
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
        color: "#777"
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

    divider: {
        height: 1,
        backgroundColor: "#eee"
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