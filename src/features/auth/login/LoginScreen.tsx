import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { colors } from "../../../theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { useLogin } from "./useLogin";
import { globalStyles } from "../../../theme/globalStyles";

type LoginScreenProps = {
    onLogin?: (email: string, password: string) => void;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">

export const LoginScreen: React.FC<LoginScreenProps> = () => {


    const [secure, setSecure] = useState(true)

    const navigation = useNavigation<NavigationProp>()

    const {
        email,
        password,
        setEmail,
        setPassword,
        login,
        loading,
        error
    } = useLogin();


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.header}>
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

                <Text style={styles.title}>Find Your Glow</Text>

                <Text style={styles.subTitle}>Book your next look with ease.</Text>

                <View style={styles.inputContainer}>
                    <MaterialIcons name="email" size={20} color={colors.secondary} />

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={colors.secondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputContainer}>
                    {/* Icono candado izquierda */}
                    <MaterialIcons name="lock" size={20} color={colors.secondary} />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={colors.secondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secure}
                        autoCapitalize="none"
                        style={styles.input}
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
                    <TouchableOpacity onPress={() => console.log("ir al recovery password")}>
                        <Text style={styles.linkForgoPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {error && <Text>{error}</Text>}

                <TouchableOpacity style={[globalStyles.primaryButton, styles.button]} onPress={login}>
                    <Text style={globalStyles.primaryButtonText}> {loading ? "Cargando..." : "Entrar"}</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.linkRegister}>¿No tenés cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                        <Text style={[styles.linkRegister, { fontWeight: "600" }]}>Registrate</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </KeyboardAvoidingView>
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
        position: 'absolute', // 🔑 saca la imagen del layout
        top: 0,
        width: '100%',
        height: '30%',
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
        flex: 1,                  // ocupa toda la pantalla
        justifyContent: 'center', // centro vertical REAL
        alignItems: 'center',     // centro horizontal
        padding: 24,
    },

    title: {
        fontSize: 33,
        fontWeight: "700",
        marginBottom: 10
    },
    subTitle: {
        color: colors.textSecondary,
        fontSize: 17,
        marginBottom: 24,
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
        marginTop: 20,
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
        marginVertical: 20,
        fontWeight: 600
    },
    linkRegister: {
        color: colors.textPrimary,
        marginTop: 16,
        fontSize: 14,
    },
});