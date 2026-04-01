import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useRecoveryPassword } from "./useRecoveryPassword";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../theme/colors";
import { globalStyles } from "../../../theme/globalStyles";
import React, { useEffect } from "react";
import { router } from "expo-router";

export default function RecoveryPasswordScreen() {

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
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Ionicons name="lock-closed" size={100} color={colors.secondary} />
                        <Text style={styles.title}>Recuperar contraseña</Text>
                        <Text style={styles.subTitle}>
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

                        {error && <Text>{error}</Text>}

                        <TouchableOpacity style={[globalStyles.primaryButton, styles.button]} onPress={recoveryPassword}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={globalStyles.primaryButtonText}>Enviar email</Text>

                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.linkRegister}>¿Recordaste tu contraseña? </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <Text style={[styles.linkRegister, { fontWeight: "600" }]}>Vuelve al login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6fa",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },

    header: {
        alignItems: "center"
    },

    title: {
        fontSize: 33,
        fontWeight: "700",
        marginVertical: 10
    },
    subTitle: {
        color: colors.textSecondary,
        fontSize: 17,
        textAlign: "center"
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
    linkRegister: {
        color: colors.textPrimary,
        marginTop: 16,
        fontSize: 14,
    },
});