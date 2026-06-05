import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useEditEmployee } from "./useEditEmployee";
import { useTheme } from "../../../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../../../theme/globalStyles";
import { darkColors, lightColors } from "../../../../../theme/colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { EmployeeStatus, employeeStatuses, Role } from "../../../../../domain/models/Service";
import { Ionicons } from "@expo/vector-icons";
import { capitalizeFirstLetter } from "../../../../../utils/capitalizeFirstLetter";
import LoadingButton from "../../../../../shared/LoadingButton";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

type Params = {
    id: string
    img: string
    name: string
    lastName: string
    status: string
    role: string
}

export default function EditEmployeeScreen() {
    const {
        id,
        img: initialImg,
        name: initialName,
        lastName: initialLastName,
        status: initialStatus,
    } = useLocalSearchParams<Params>()

    const {
        employeeId, setEmployeeId,
        image, setImage,
        newImage, setNewImage,
        name, setName,
        setInitialName,
        lastName, setLastName,
        setInitialLastName,
        selectedStatus, setSelectedStatus,
        setInitialSelectedStatus,
        editingEmployee,
        loading,
        success,
        error,
        editEmployee
    } = useEditEmployee()

    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)

    const colors = isDarkMode ? darkColors : lightColors
    const navigation = useNavigation()

    const tabBarHeight = useBottomTabBarHeight();

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
                title: 'Empleado editado',
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


    useEffect(() => {
        setEmployeeId(Number(id))
        setImage(initialImg)
        setInitialName(initialName)
        setName(initialName)
        setInitialLastName(initialLastName)
        setLastName(initialLastName)
        setInitialSelectedStatus(initialStatus as EmployeeStatus)
        setSelectedStatus(initialStatus as EmployeeStatus)
    }, [])

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0].uri);
        } else {
            console.log("No seleccionaste ninguna imagen.")
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
                <View style={{ gap: 30, paddingBottom: tabBarHeight }}>
                    <View>
                        <Text style={globalStyles.title}>Editar servicio</Text>
                        <Text style={globalStyles.subTitle}>
                            Edita la información de tu empleado para mantenerla actualizada. Modifica su foto, nombre, apellido y disponibilidad para gestionar tus turnos de forma eficiente.                        </Text>
                    </View>
                    <View style={[globalStyles.card, { position: "relative" }]}>

                        <View
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 100,
                                backgroundColor: colors.primary,
                                borderRadius: 999,
                                padding: 10,
                                zIndex: 999
                            }}
                        >
                            <Ionicons
                                name="pencil"
                                size={25}
                                color="black"
                                onPress={pickImage}
                            />
                        </View>

                        {/*Imagen*/}
                        <Pressable onPress={pickImage} disabled={!!image} style={{ alignItems: "center" }}>
                            {image ?
                                <Image source={{ uri: newImage ? newImage : image }} style={{ width: 125, height: 125, borderRadius: 100 }} />
                                :
                                <View style={{ width: "100%", height: 140, backgroundColor: colors.background, borderRadius: 16, justifyContent: "center", alignItems: "center" }}>
                                    <Ionicons name="camera" size={50} color={colors.textSecondary} />
                                    <Text style={{ color: colors.textSecondary }}>Upload service image</Text>
                                </View>
                            }

                        </Pressable>

                        {/*Titulo*/}
                        <View>
                            <Text style={globalStyles.label}>Name</Text>
                            <TextInput
                                placeholder="Titulo para servicio"
                                placeholderTextColor={colors.secondary}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="none"
                                keyboardType="default"
                                style={globalStyles.textInput}
                            />
                        </View>

                        {/*Descripcion*/}
                        <View>
                            <Text style={globalStyles.label}>Last name</Text>
                            <TextInput
                                placeholder="Descripcion para servicio"
                                placeholderTextColor={colors.secondary}
                                value={lastName}
                                onChangeText={setLastName}
                                autoCapitalize="none"
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
                                {Object.values(employeeStatuses).map((employeeStatus) => {
                                    const isSelected = selectedStatus === employeeStatus;

                                    return (
                                        <Pressable
                                            key={employeeStatus}
                                            style={{
                                                backgroundColor: isSelected ? colors.primary : colors.background,
                                                paddingHorizontal: 16,
                                                paddingVertical: 10,
                                                borderRadius: 12,
                                            }}
                                            onPress={() => setSelectedStatus(employeeStatus)}
                                        >
                                            <Text
                                                style={{
                                                    color: !isSelected ? colors.textPrimary : colors.background,
                                                    fontWeight: isSelected ? '600' : '400'
                                                }}
                                            >{capitalizeFirstLetter(employeeStatus)}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>

                        <View>
                            <Text style={{ fontWeight: '700', color: colors.textPrimary, textTransform: "uppercase" }}>Visibilidad de la pantalla</Text>
                            <Text style={{ color: colors.textSecondary, marginTop: 5 }}>Este empleado será visible inmediatamente en el catálogo de Luminous Noir Boutique tras su edición.</Text>
                        </View>

                        <TouchableOpacity style={[globalStyles.primaryButton]} onPress={() => editEmployee()} disabled={editingEmployee} >
                            {editingEmployee ? (
                                <LoadingButton />
                            ) : (
                                <Text style={globalStyles.primaryButtonText}>Guardar cambios</Text>
                            )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}