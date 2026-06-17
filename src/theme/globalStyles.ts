import { StyleSheet } from "react-native";
import { lightColors, darkColors } from "./colors";

export const createGlobalStyles = (isDarkMode: boolean) => {
    const colors = isDarkMode ? darkColors : lightColors;
    return StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor: colors.background,
            padding: 24
        },
        primaryButton: {
            backgroundColor: colors.primary,
            height: 50,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
        },

        primaryButtonText: {
            color: "#1E1E1E",
            fontSize: 16,
            fontWeight: "600",
        },

        title: {
            fontSize: 33,
            fontWeight: "700",
            color: colors.textPrimary,
            textTransform: "capitalize"
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
            height: 50,
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

        error: {
            color: colors.error,
            fontSize: 14,
            marginBottom: 12,
            fontWeight: "500"
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

        imageEmployee: {
            borderRadius: 50,
            width: 50,
            height: 50
        },
        textEmployee: {
            color: colors.textPrimary,
            marginTop: 3,
            textTransform: "capitalize"
        },

        //edit-add service
        card: {
            backgroundColor: colors.bgCard,
            gap: 20,
            borderRadius: 16,
            padding: 20,
        },

        label: {
            fontWeight: "700",
            color: colors.textSecondary,
            textTransform: "uppercase",
            marginBottom: 10,
        },
        textInput: {
            color: colors.textPrimary,
            backgroundColor: colors.background,
            borderRadius: 50,
            height: 50,
            paddingHorizontal: 20,
            fontWeight: '500'
        },
        formRow: {
            flex: 1,
            flexDirection: "row",
            gap: 7
        },

        hourText: {
            color: colors.textPrimary,
            fontWeight: '400'
        }
    });
};