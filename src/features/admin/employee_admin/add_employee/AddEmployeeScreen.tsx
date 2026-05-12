import { Alert, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../../theme/globalStyles";
import { darkColors, lightColors } from "../../../../theme/colors";
import { useNavigation, useRouter } from "expo-router";
import { useAddEmployee } from "./useAddEmployee";
import LoadingButton from "../../../../shared/LoadingButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { roles } from "../../../../domain/models/Service";
import React, { useEffect } from "react";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

export default function AddEmployeeScreen() {
    const { email, setEmail,
        loading,
        addingRole,
        selectedRole, setSelectedRole,
        success,
        error,
        errorForm,
        isFormValid,
        addEmployee
    } = useAddEmployee()

    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors
    const router = useRouter();

    const tabBarHeight = useBottomTabBarHeight();
    const navigation = useNavigation()

    useEffect(() => {
        if (error) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: error,
                button: "Cerrar",
                closeOnOverlayTap: false,
            });
        }

        if (success) {
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Rol agregado',
                textBody: 'Puedes ver todos los empleados y admin en la seccion de empleados',
                button: 'Continuar',
                closeOnOverlayTap: false,
                onPressButton: () => {
                    Dialog.hide();
                    navigation.goBack();
                },
            });
        }
    }, [error, success])

    const handleAddRole = () => {
        isFormValid()
        console.log(isFormValid())
        console.log(errorForm)
        if (isFormValid()) {
            Alert.alert(
                "Agregar rol",
                `Estás seguro de que querés agregar a  ${email} como ${selectedRole}?`,
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Agregar",
                        onPress: () => addEmployee(),
                    },
                ]
            );
        }
    }

    return (
        <View style={[globalStyles.container, { gap: 30, paddingBottom: tabBarHeight }]}>
            <View>
                <Text style={globalStyles.title}>Agregar rol</Text>
                <Text style={globalStyles.subTitle}>
                    Agrega a un nuevo empleado o administrador por correo electrónico.
                </Text>
            </View>
            <View style={globalStyles.card}>

                {/*Titulo*/}
                <View>
                    <Text style={globalStyles.label}>Email address</Text>
                    <TextInput
                        placeholder="Enter email"
                        placeholderTextColor={colors.secondary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={globalStyles.textInput}
                    />
                </View>

                <View>
                    <Text style={globalStyles.label}>Access role</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 10,
                        }}
                    >
                        {Object.values(roles)
                            .filter((role) => role !== roles.USER)
                            .map((role) => {
                                const isSelected = selectedRole === role;

                                return (
                                    <Pressable
                                        key={role}
                                        style={{
                                            backgroundColor: isSelected ? colors.primary : colors.background,
                                            paddingHorizontal: 16,
                                            paddingVertical: 10,
                                            borderRadius: 12,
                                        }}
                                        onPress={() => setSelectedRole(role)}
                                    >
                                        <Text
                                            style={{
                                                fontWeight: isSelected ? '600' : '400'
                                            }}
                                        >{capitalizeFirstLetter(role)}</Text>
                                    </Pressable>
                                )
                            })}

                    </View>

                </View>

                {errorForm && <Text style={globalStyles.error}>❌ {errorForm}</Text>}

                <TouchableOpacity style={[globalStyles.primaryButton]} onPress={() => handleAddRole()} disabled={addingRole} >
                    {addingRole ? (
                        <LoadingButton />
                    ) : (
                        <Text style={globalStyles.primaryButtonText}>Agregar rol</Text>
                    )
                    }
                </TouchableOpacity>
            </View>
        </View>
    )
}