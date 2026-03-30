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

    title: {
        fontSize: 33,
        fontWeight: "700",
    },

    subTitle: {
        color: colors.textSecondary,
        fontSize: 17,
    },

    input: {
        flex: 1,
        marginLeft: 8,
        color: colors.textPrimary,
        fontSize: 16,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 50,
        paddingHorizontal: 12,
        height: 50,
        marginBottom: 20,
    },
})