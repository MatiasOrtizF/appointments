import { StyleSheet } from "react-native";
import { lightColors, darkColors } from "./colors";

export const createAdminAppointmentStyles = (isDarkMode: boolean) => {
    const colors = isDarkMode ? darkColors : lightColors;
    return StyleSheet.create({

        card: {
            flexDirection: "row",
            borderRadius: 16,
            padding: 16,
            marginVertical: 8,
            elevation: 3, // android
            shadowColor: "#000", // ios
            shadowOpacity: 0.1,
            shadowRadius: 6,
            backgroundColor: colors.bgCard
        },

        timeContainer: {
            justifyContent: "center",
            marginRight: 16,
        },

        time: {
            fontSize: 18,
            fontWeight: "bold",
            color: colors.textPrimary
        },

        infoContainer: {
            flex: 1,
            justifyContent: "space-between",
        },

        client: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.textPrimary
        },

        service: {
            fontSize: 14,
            color: colors.textSecondary,
            textTransform: "capitalize",
            marginVertical: 2
        },

        professional: {
            fontSize: 12,
            color: "#888",
        },

        statusContainer: {
            justifyContent: "flex-start",
            alignItems: "center"
        },

        statusBadge: {
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 50
        },

        status: {
            fontWeight: "600",
            textTransform: "capitalize"
        },
    });
};