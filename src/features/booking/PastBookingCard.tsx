import { View, Image, Text, StyleSheet } from "react-native";
import { Appointment } from "../../domain/models/Appointment"
import { STATUS_STYLES } from "../../constants/statusStyles";
import { useTheme } from "../../data/provider/ThemeProvider";
import { darkColors, lightColors } from "../../theme/colors";
import { createGlobalStyles } from "../../theme/globalStyles";

type Props = {
  appointment: Appointment
}

export const PastBookingCard = ({ appointment }: Props) => {
  const { id, serviceImg, status, service, date, time } = appointment
  const statusStyle =
    STATUS_STYLES[status.toLowerCase() as keyof typeof STATUS_STYLES];

  const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
  const colors = isDarkMode ? darkColors : lightColors

  return (
    <View style={[styles.card, {backgroundColor: colors.bgCard}]}>

      {/* Imagen izquierda */}
      <Image source={{ uri: serviceImg }} style={styles.image} />

      {/* Información central */}
      <View style={styles.infoContainer}>
        <View style={globalStyles.status}>
          <View style={[
            globalStyles.statusDot,
            { backgroundColor: statusStyle.text }
          ]} />
          <Text style={[
            styles.statusText,
            { color: statusStyle.text }
          ]}>{status}</Text>
        </View>
        <Text style={[styles.serviceName, {color: colors.textPrimary}]}>{service}</Text>
        <View style={styles.dateContainer}>
          <Text style={[styles.date, {color: colors.textSecondary}]}>{date}</Text>
          <Text style={[styles.date, {color: colors.textSecondary}]}>{" \u2022 "}</Text>
          <Text style={[styles.date, {color: colors.textSecondary}]}>{time}</Text>
        </View>
      </View>

      {/* Botón derecha */}
      {/*<TouchableOpacity onPress={() => onCancel(id)}>
        <Ionicons name="close-circle-outline" size={40} color="red" />
      </TouchableOpacity>*/}

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 13
  }
});