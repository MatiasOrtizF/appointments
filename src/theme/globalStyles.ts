import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const globalStyles = StyleSheet.create({
    primaryButton: {
        backgroundColor: colors.primary,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },

    primaryButtonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
    },
})