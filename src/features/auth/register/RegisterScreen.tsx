import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text, View, Image, TextInput, TouchableOpacity, StyleSheet, Platform, Keyboard } from "react-native";
import { useRegister } from "./useRegister";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/types";
import { colors } from "../../../theme/colors";
import { globalStyles } from "../../../theme/globalStyles";

type RegisterScreenProps = {
    onRegister?: (email: string, password: string) => void;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Register">

export default function RegisterScreen() {

    const [keyboardVisible, setKeyboardVisible] = useState(false)
    const [secure, setSecure] = useState(true)

    const navigation = useNavigation<NavigationProp>()

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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={[styles.header, { height: keyboardVisible ? "15%" : "25%" }
            ]}>
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

                <Text style={styles.title}>Create your account</Text>

                {!keyboardVisible ?
                    <Text style={styles.subTitle}>Join our beauty community to book your next glow-up instantly.</Text>
                    :
                    null
                }

                {/* Fullname */}
                <View style={styles.inputContainer}>
                    <MaterialIcons name="person" size={20} color={colors.secondary} />

                    <TextInput
                        placeholder="Full Name"
                        placeholderTextColor={colors.secondary}
                        value={fullName}
                        onChangeText={setFullName}
                        keyboardType="default"
                        style={styles.input}
                    />
                </View>


                {/* Email */}
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

                {/* Password */}
                <View style={styles.inputContainer}>
                    {/* Icono */}
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
                <View style={styles.inputContainer}>
                    {/* Icono */}
                    <MaterialIcons name="lock" size={20} color={colors.secondary} />

                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor={colors.secondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={secure}
                        autoCapitalize="none"
                        style={styles.input}
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

                {error && <Text style={styles.errorText}>❌ {error}</Text>}

                <TouchableOpacity style={[globalStyles.primaryButton, styles.button]} onPress={register}>
                    <Text style={globalStyles.primaryButtonText}> {loading ? "Cargando..." : "Crear Cuenta"}</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.linkRegister}>¿Ya tenés cuenta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={[styles.linkRegister, { fontWeight: "600" }]}>Inicia sesion</Text>
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

    title: {
        fontSize: 33,
        fontWeight: "700",
        marginBottom: 10
    },
    subTitle: {
        color: colors.textSecondary,
        fontSize: 17,
        marginBottom: 25,
        textAlign: "center"
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
        width: "100%",
        marginVertical: 25
    },
    linkRegister: {
        color: colors.textPrimary,
        marginTop: 10,
        fontSize: 14,
    },

    errorText: {
        color: "#ff3b30",
        marginTop: 10,
        fontSize: 14,
    }
});