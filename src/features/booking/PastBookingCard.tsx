import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Appointment } from "../../domain/models/Appointment"
import { Ionicons } from "@expo/vector-icons";
import { STATUS_STYLES } from "../../constants/statusStyles";

type Props = {
  appointment: Appointment
  onCancel: (bookingId: string) => void
}

export const PastBookingCard: React.FC<Props> = ({
  appointment,
  onCancel
}) => {
  const { id, serviceImg, status, service, date, time } = appointment
  const statusStyle =
    STATUS_STYLES[status.toLowerCase() as keyof typeof STATUS_STYLES];

  return (
    <View style={styles.card}>

      {/* Imagen izquierda */}
      <Image source={{ uri: serviceImg }} style={styles.image} />

      {/* Información central */}
      <View style={styles.infoContainer}>
        <View style={styles.status}>
          <View style={[
            styles.statusDot,
            { backgroundColor: statusStyle.text }
          ]} />
          <Text style={[
            styles.statusText,
            { color: statusStyle.text }
          ]}>{status}</Text>
        </View>
        <Text style={styles.serviceName}>{service}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.date}>{" \u2022 "}</Text>
          <Text style={styles.date}>{time}</Text>
        </View>
      </View>

      {/* Botón derecha */}
      <TouchableOpacity onPress={() => onCancel(id)}>
        <Ionicons name="close-circle-outline" size={40} color="red" />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,

    // Android
    elevation: 4,

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 12
  },

  infoContainer: {
    flex: 1,
    justifyContent: "space-between"
  },

  status: {
    flexDirection: "row",
    alignItems: "center"
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase"
  },

  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
    marginVertical: 2
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  date: {
    fontSize: 13,
    color: "#666"
  }
});