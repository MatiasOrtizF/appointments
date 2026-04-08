import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { lightColors, darkColors } from "../../../theme/colors";
import { createGlobalStyles } from "../../../theme/globalStyles";
import { useChangePassword } from "./useChangePassword";
import { useKeyboard } from "../../../hooks/useKeyboard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useTheme } from "../../../data/provider/ThemeProvider";

export default function ChangePasswordScreen() {
    const [currentPasswordSecure, setCurrentPasswordSecure] = useState(true)
    const [newPasswordsecure, setNewPasswordSecure] = useState(true)
    const [confirmNewPasswordSecure, setConfirmNewPasswordSecure] = useState(true)

    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors

    const navigation = useNavigation()

    const {
        currentPassword,
        newPassword,
        confirmNewPassword,
        validations,
        setCurrentPassword,
        setNewPassword,
        setConfirmNewPassword,
        changePassword,
        loading,
        error,
        success
    } = useChangePassword();

    const isKeyboardVisible = useKeyboard()

    const passwordRules = [
        { key: "hasMinLength", label: "Debe tener al menos 8 caracteres" },
        { key: "hasUppercase", label: "Debe contener una mayúscula" },
        { key: "hasLowercase", label: "Debe contener una minúscula" },
        { key: "hasNumber", label: "Debe contener un número" },
        { key: "hasNoSpaces", label: "No debe contener espacios" },
        { key: "hasMatching", label: "Las contraseñas deben coincidir" }
    ] as const

    useEffect(() => {
        if (success) {
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Contraseña actualizada',
                textBody: 'Tu contraseña se actualizó correctamente',
                button: 'Continuar',
                closeOnOverlayTap: false,
                onPressButton: () => {
                    Dialog.hide();
                    navigation.goBack();
                },
            });
        }
    }, [success])

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{ paddingBottom: 20 }}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >

            <View style={styles.content}>

                <Ionicons style={{ textAlign: "center" }} name="lock-closed-outline" size={100} color={colors.secondary} />

                <Text style={[globalStyles.title, styles.title]}>Cambiar contraseña</Text>

                {!isKeyboardVisible ?
                    <Text style={[globalStyles.subTitle, styles.subTitle]}>Ingresa tu contraseña actual y define una nueva segura.</Text>
                    :
                    null
                }

                {/* Current Password */}
                <Text style={[styles.label, {color: colors.textPrimary}]}>Contraseña actual</Text>
                <View style={globalStyles.inputContainer}>
                    {/* Icono */}
                    <MaterialIcons name="lock" size={20} color={colors.secondary} />

                    <TextInput
                        placeholder="Current Password"
                        placeholderTextColor={colors.secondary}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry={currentPasswordSecure}
                        autoCapitalize="none"
                        style={globalStyles.input}
                    />

                    {/* Ocultar/ Revelar */}
                    <TouchableOpacity onPress={() => setCurrentPasswordSecure(!currentPasswordSecure)}>
                        <MaterialIcons
                            name={currentPasswordSecure ? 'visibility-off' : 'visibility'}
                            size={20}
                            color={colors.secondary}
                        />
                    </TouchableOpacity>
                </View>

                {/* New Password */}
                <Text style={[styles.label, {color: colors.textPrimary}]}>Nueva contraseña</Text>
                <View style={globalStyles.inputContainer}>
                    {/* Icono */}
                    <MaterialIcons name="lock" size={20} color={colors.secondary} />

                    <TextInput
                        placeholder="New Password"
                        placeholderTextColor={colors.secondary}
                        value={newPassword}
                        onChangeText={(text) => {
                            setNewPassword(text)
                        }}
                        secureTextEntry={newPasswordsecure}
                        autoCapitalize="none"
                        style={globalStyles.input}
                    />

                    {/* Ocultar/ Revelar */}
                    <TouchableOpacity onPress={() => setNewPasswordSecure(!newPasswordsecure)}>
                        <MaterialIcons
                            name={newPasswordsecure ? 'visibility-off' : 'visibility'}
                            size={20}
                            color={colors.secondary}
                        />
                    </TouchableOpacity>
                </View>

              {/* Confirm New Password */}
                <Text style={[styles.label, {color: colors.textPrimary}]}>Confirmar nueva contraseña</Text>
                <View style={globalStyles.inputContainer}>
                    {/* Icono */}
                    <MaterialIcons name="lock" size={20} color={colors.secondary} />

                    <TextInput
                        placeholder="Confirm New Password"
                        placeholderTextColor={colors.secondary}
                        value={confirmNewPassword}
                        onChangeText={(text) => {
                            setConfirmNewPassword(text)
                        }}
                        secureTextEntry={confirmNewPasswordSecure}
                        autoCapitalize="none"
                        style={globalStyles.input}
                    />

                    {/* Ocultar/ Revelar */}
                    <TouchableOpacity onPress={() => setConfirmNewPasswordSecure(!confirmNewPasswordSecure)}>
                        <MaterialIcons
                            name={confirmNewPasswordSecure ? 'visibility-off' : 'visibility'}
                            size={20}
                            color={colors.secondary}
                        />
                    </TouchableOpacity>
                </View>

                {error && <Text style={styles.errorText}>❌ {error}</Text>}

                {passwordRules.map((rule) => {
                    const isValid = validations?.[rule.key]

                    return (
                        <View key={rule.key} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <Ionicons
                                name={isValid ? "checkmark-circle" : "close-circle"}
                                size={20}
                                color={isValid ? colors.success : colors.error}
                            />

                            <Text
                                style={{
                                    textDecorationLine: isValid ? "line-through" : "none",
                                    color: isValid ? colors.success : colors.error
                                }}
                            >
                                {rule.label}
                            </Text>
                        </View>
                    )
                })}

                <TouchableOpacity
                    style={[
                        globalStyles.primaryButton,
                        styles.button
                    ]}
                    onPress={changePassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.textPrimary} />
                    ) : (
                        <Text style={globalStyles.primaryButtonText}>Actualizar contraseña</Text>
                    )}
                </TouchableOpacity>

            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },

    title: {
        textAlign: "center",
        marginBottom: 10
    },
    subTitle: {
        marginBottom: 25,
        textAlign: "center"
    },

    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 6,
        marginLeft: 4
    },

    button: {
        width: "100%",
        marginTop: 25
    },
    errorText: {
        color: "#ff3b30",
        marginVertical: 5,
        fontSize: 14,
    }
});