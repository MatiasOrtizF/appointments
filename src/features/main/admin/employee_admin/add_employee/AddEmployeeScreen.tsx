import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../../../theme/globalStyles";
import { darkColors, lightColors } from "../../../../../theme/colors";
import { useNavigation, useRouter } from "expo-router";
import { useAddEmployee } from "./useAddEmployee";
import LoadingButton from "../../../../../shared/components/LoadingButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { employeeStatuses, roles } from "../../../../../domain/models/service/Service";
import React, { useEffect } from "react";
import { capitalizeFirstLetter } from "../../../../../utils/capitalizeFirstLetter";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { Ionicons } from "@expo/vector-icons";

export default function AddEmployeeScreen() {
    const { image, setImage,
        name, setName,
        lastName, setLastName,
        selectedStatus, setSelectedStatus,
        loading,
        addingEmployee,
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
                title: 'Empleado agregado!',
                textBody: 'Puedes ver todos los empleados en la seccion de empleados',
                button: 'Continuar',
                closeOnOverlayTap: false,
                onPressButton: () => {
                    Dialog.hide();
                    navigation.goBack();
                },
            });
        }
    }, [error, success])

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        } else {
            console.log("No seleccionaste ninguna imagen.")
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
                <View style={{ gap: 30, paddingBottom: tabBarHeight }}>
                    <View>
                        <Text style={globalStyles.title}>Agregar empleado</Text>
                        <Text style={globalStyles.subTitle}>
                            Agrega a un nuevo empleado.
                        </Text>
                    </View>
                    <View style={globalStyles.card}>

                        {/*Imagen*/}
                        <Pressable onPress={pickImage}>
                            {image ?
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: "100%", height: 140, borderRadius: 16 }}
                                />
                                :
                                <View style={{ width: "100%", height: 140, backgroundColor: colors.background, borderRadius: 16, justifyContent: "center", alignItems: "center" }}>
                                    <Ionicons name="camera" size={50} color={colors.textSecondary} />
                                    <Text style={{ color: colors.textSecondary }}>Upload service image</Text>
                                </View>
                            }

                        </Pressable>

                        {/*Nombre*/}
                        <View>
                            <Text style={globalStyles.label}>Nombre</Text>
                            <TextInput
                                placeholder="Ingrese el nombre"
                                placeholderTextColor={colors.secondary}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                keyboardType="default"
                                style={globalStyles.textInput}
                            />
                        </View>

                        {/*Apellido*/}
                        <View>
                            <Text style={globalStyles.label}>Apellido</Text>
                            <TextInput
                                placeholder="Ingrese el apellido"
                                placeholderTextColor={colors.secondary}
                                value={lastName}
                                onChangeText={setLastName}
                                autoCapitalize="words"
                                keyboardType="default"
                                style={globalStyles.textInput}
                            />
                        </View>

                        <View>
                            <Text style={globalStyles.label}>Estado</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 10,
                                }}
                            >
                                {Object.values(employeeStatuses)
                                    .map((status) => {
                                        const isSelected = status === selectedStatus;

                                        return (
                                            <Pressable
                                                key={status}
                                                style={{
                                                    backgroundColor: isSelected ? colors.primary : colors.background,
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 10,
                                                    borderRadius: 12,
                                                }}
                                                onPress={() => setSelectedStatus(status)}
                                            >
                                                <Text
                                                    style={{
                                                        color: !isSelected ? colors.textPrimary : colors.background,
                                                        fontWeight: isSelected ? '600' : '400'
                                                    }}
                                                >{capitalizeFirstLetter(status)}</Text>
                                            </Pressable>
                                        )
                                    })}

                            </View>

                        </View>

                        {errorForm && <Text style={globalStyles.error}>❌ {errorForm}</Text>}

                        <TouchableOpacity style={[globalStyles.primaryButton]} onPress={() => addEmployee()} disabled={addingEmployee} >
                            {addingEmployee ? (
                                <LoadingButton />
                            ) : (
                                <Text style={globalStyles.primaryButtonText}>Agregar rol</Text>
                            )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}