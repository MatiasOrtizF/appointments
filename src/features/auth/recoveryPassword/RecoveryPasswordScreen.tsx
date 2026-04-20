import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useRecoveryPassword } from "./useRecoveryPassword";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { lightColors, darkColors } from "../../../theme/colors";
import { createGlobalStyles } from "../../../theme/globalStyles";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { useTheme } from "../../../data/provider/ThemeProvider";
import LoadingButton from "../../../shared/LoadingButton";

export default function RecoveryPasswordScreen() {
    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors

    const {
        email,
        setEmail,
        success,
        recoveryPassword,
        loading,
        error,
    } = useRecoveryPassword();

    useEffect(() => {
        if (success) {
            Alert.alert(
                "Email enviado",
                `Enviamos un enlace de recuperación a ${email}. Revisá tu bandeja de entrada y spam.`,
                [
                    {
                        text: "OK",
                        onPress: () => {
                            router.back()
                        },
                    }
                ]
            );
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            Alert.alert("Error", error);
        }
    }, [error]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
                    <View style={styles.header}>
                        <Ionicons name="lock-closed" size={100} color={colors.secondary} />
                        <Text style={[globalStyles.title, { marginVertical: 10 }]}>Recuperar contraseña</Text>
                        <Text style={[globalStyles.subTitle, { textAlign: 'center' }]}>
                            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
                        </Text>
                    </View>

                    <View style={styles.content}>

                        <View style={globalStyles.inputContainer}>
                            <MaterialIcons name="email" size={20} color={colors.secondary} />

                            <TextInput
                                placeholder="Email"
                                placeholderTextColor={colors.secondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={globalStyles.input}
                            />
                        </View>

                        {error && <Text style={globalStyles.error}>❌ {error}</Text>}

                        <TouchableOpacity style={[globalStyles.primaryButton, styles.button]} onPress={recoveryPassword} disabled={loading}>
                            {loading ? (
                                <LoadingButton />
                            ) : (
                                <Text style={globalStyles.primaryButtonText}>Enviar email</Text>

                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.linkLogin, { color: colors.textPrimary }]}>¿Recordaste tu contraseña? </Text>
                        <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                            <Text style={[styles.linkLogin, { fontWeight: "600", color: colors.textPrimary }]}>Vuelve al login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center"
    },

    content: {
        width: "100%",
        marginVertical: 24
    },
    button: {
        width: "100%",
        marginTop: 16,
    },

    footer: {
        flexDirection: 'row',
    },
    linkLogin: {
        marginTop: 16,
        fontSize: 14,
    },
});