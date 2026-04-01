import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard } from "react-native";
import { colors } from "../../../theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLogin } from "./useLogin";
import { globalStyles } from "../../../theme/globalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";


export const LoginScreen = () => {
    const router = useRouter();
    const [keyboardVisible, setKeyboardVisible] = useState(false)
    const [secure, setSecure] = useState(true)

    const {
        email,
        password,
        setEmail,
        setPassword,
        login,
        user,
        loading,
        error
    } = useLogin();

    /*useEffect(() => {
        if (user != null) {
            router.replace('/bottom'); // o '/verify-email' si corresponde
        }
    }, [user]);*/

    useEffect(() => {
        if (user != null) {
            if (!user.emailVerified) router.replace('/verify-email');
            else {
                router.replace('/bottom');
            }
        }
    }, [user]);

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
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View
                    style={[
                        styles.header,
                        { height: keyboardVisible ? "20%" : "30%" },
                    ]}
                >
                    <Image
                        source={require('../../../../assets/img_header_login.jpg')}
                        style={styles.image}
                        resizeMode="cover"
                        blurRadius={1}
                    />

                    <LinearGradient
                        colors={['transparent', '#f4f6fa']}
                        style={styles.gradient}
                    />

                </View>

                <View style={styles.content}>

                    <Text style={[globalStyles.title, { marginBottom: 10 }]}>Find Your Glow</Text>
                    <Text style={[globalStyles.subTitle, { marginBottom: 24 }]}>Book your next look with ease.</Text>

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

                    <View style={globalStyles.inputContainer}>
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

                        {/* Ojo derecha */}
                        <TouchableOpacity onPress={() => setSecure(!secure)}>
                            <MaterialIcons
                                name={secure ? 'visibility-off' : 'visibility'}
                                size={20}
                                color={colors.secondary}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.linkContainer}>
                        <TouchableOpacity onPress={() => router.push('/auth/recovery-password')}>
                            <Text style={styles.linkForgoPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {error && <Text>{error}</Text>}

                    <TouchableOpacity style={[globalStyles.primaryButton, styles.button]} onPress={login}>
                        <Text style={globalStyles.primaryButtonText}> {loading ? "Cargando..." : "Entrar"}</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.linkRegister}>¿No tenés cuenta? </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/register')}>
                            <Text style={[styles.linkRegister, { fontWeight: "600" }]}>Registrate</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6fa",
        justifyContent: "center",
        alignItems: 'center',
        padding: 24,
    },
    header: {
        position: 'absolute',
        top: 0,
        width: '100%',
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
        width: "100%"
    },
    linkContainer: {
        width: '100%',
        alignItems: 'flex-end',
    },
    linkForgoPassword: {
        color: colors.secondary,
        marginVertical: 15,
        fontWeight: 600
    },
    linkRegister: {
        color: colors.textPrimary,
        marginTop: 24,
        fontSize: 14,
    },
});
