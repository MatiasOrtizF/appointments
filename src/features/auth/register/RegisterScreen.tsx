import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text, View, Image, TextInput, TouchableOpacity, StyleSheet, Platform, Keyboard, ScrollView } from "react-native";
import { useRegister } from "./useRegister";
import { lightColors, darkColors } from "../../../theme/colors";
import { createGlobalStyles } from "../../../theme/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../../../data/provider/ThemeProvider";

export default function RegisterScreen() {
    const [keyboardVisible, setKeyboardVisible] = useState(false)
    const [secure, setSecure] = useState(true)
    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors

    const {
        fullName,
        email,
        password,
        confirmPassword,
        setFullName,
        setEmail,
        setPassword,
        setConfirmPassword,
        register,
        loading,
        error
    } = useRegister();


    useEffect(() => {

        const show = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true)
        })

        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false)
        })

        return () => {
            show.remove()
            hide.remove()
        }

    }, [])


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 604 : 0} // Ajusta según tu header

            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,

                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Image
                            source={require('../../../../assets/img_header_login.jpg')}
                            style={styles.image}
                            resizeMode="cover"
                            blurRadius={1}
                        />

                        <LinearGradient
                            colors={['transparent', colors.background]}
                            style={styles.gradient}
                        />

                    </View>

                    <View style={styles.content}>

                        <Text style={[globalStyles.title, { marginBottom: 10 }]}>Create your account</Text>

                        {!keyboardVisible ?
                            <Text style={[globalStyles.subTitle, { marginBottom: 25, textAlign: 'center' }]}>Join our beauty community to book your next glow-up instantly.</Text>
                            :
                            null
                        }

                        {/* Fullname */}
                        <View style={globalStyles.inputContainer}>
                            <MaterialIcons name="person" size={20} color={colors.secondary} />

                            <TextInput
                                placeholder="Full Name"
                                placeholderTextColor={colors.secondary}
                                value={fullName}
                                onChangeText={setFullName}
                                keyboardType="default"
                                style={globalStyles.input}
                            />
                        </View>


                        {/* Email */}
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

                        {/* Password */}
                        <View style={globalStyles.inputContainer}>
                            {/* Icono */}
                            <MaterialIcons name="lock" size={20} color={colors.secondary} />

                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={colors.secondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={secure}
                                autoCapitalize="none"
                                style={globalStyles.input}
                            />

                            {/* Ocultar/ Revelar */}
                            <TouchableOpacity onPress={() => setSecure(!secure)}>
                                <MaterialIcons
                                    name={secure ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color={colors.secondary}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password */}
                        <View style={globalStyles.inputContainer}>
                            {/* Icono */}
                            <MaterialIcons name="lock" size={20} color={colors.secondary} />

                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor={colors.secondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={secure}
                                autoCapitalize="none"
                                style={globalStyles.input}
                            />

                            {/* Ocultar/ Revelar */}
                            <TouchableOpacity onPress={() => setSecure(!secure)}>
                                <MaterialIcons
                                    name={secure ? 'visibility-off' : 'visibility'}
                                    size={20}
                                    color={colors.secondary}
                                />
                            </TouchableOpacity>
                        </View>

                        {error && <Text style={[styles.errorText, {color: colors.error}]}>❌ {error}</Text>}

                        <TouchableOpacity style={[globalStyles.primaryButton, styles.button]} onPress={register} disabled={loading}>
                            <Text style={globalStyles.primaryButtonText}> {loading ? "Cargando..." : "Crear Cuenta"}</Text>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.linkLogin, { color: colors.textPrimary }]}>¿Ya tenés cuenta? </Text>
                            <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                                <Text style={[styles.linkLogin, { fontWeight: "600", color: colors.textPrimary }]}>Inicia sesion</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: "20%"
    },

    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 120,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    button: {
        width: "100%",
        marginVertical: 25
    },
    linkLogin: {
        marginTop: 10,
        fontSize: 14,
    },

    errorText: {
        fontWeight: "500",
        marginTop: 10,
        fontSize: 14,
    }
});