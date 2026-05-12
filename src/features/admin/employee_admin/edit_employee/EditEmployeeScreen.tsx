import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useEditEmployee } from "./useEditEmployee";
import { useTheme } from "../../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../../theme/globalStyles";
import { darkColors, lightColors } from "../../../../theme/colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { Employee, EmployeeStatus, employeeStatuses, Role, roles } from "../../../../domain/models/Service";
import { Ionicons } from "@expo/vector-icons";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import LoadingButton from "../../../../shared/LoadingButton";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

type Params = {
    id: string
    img: string
    name: string
    lastName: string
    role: string
    status: string
}

export default function EditEmployeeScreen() {
    const {
        id,
        img: initialImg,
        name: initialName,
        lastName: initialLastName,
        role: initialRole,
        status: initialStatus
    } = useLocalSearchParams<Params>()

    const {
        employeeId, setEmployeeId,
        image, setImage,
        name, setName,
        lastName, setLastName,
        selectedRole, setSelectedRole,
        selectedStatus, setSelectedStatus,
        editingEmployee,
        loading,
        success,
        error,
        refreshing,
        onRefresh,
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


    useEffect(() => {
        setEmployeeId(id)
        setImage(initialImg)
        setName(initialName)
        setLastName(initialLastName)
        console.log("initial role:" + initialRole)
        setSelectedRole(initialRole as Role)
        setSelectedStatus(initialStatus as EmployeeStatus)
    }, [])

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
                        <Text style={globalStyles.title}>Editar servicio</Text>
                        <Text style={globalStyles.subTitle}>
                            Edita la información de tu servicio para mantenerla actualizada. Modifica el precio, duración y disponibilidad para gestionar tus turnos de forma eficiente.                        </Text>
                    </View>
                    <View style={[globalStyles.card, { position: "relative" }]}>

                        <View
                            style={{
                                position: "absolute",
                                top: 10,
                                right: 10,
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
                        <Pressable onPress={pickImage} disabled={!!image}>
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
                                                    fontWeight: isSelected ? '600' : '400'
                                                }}
                                            >{capitalizeFirstLetter(employeeStatus)}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>

                        <View>
                            <Text style={globalStyles.label}>Rol</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 10,
                                }}
                            >
                                {Object.values(roles).map((role) => {
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

                        <View>
                            <Text style={{ fontWeight: '700', color: colors.textPrimary, textTransform: "uppercase" }}>Visibilidad de la pantalla</Text>
                            <Text style={{ color: colors.textSecondary, marginTop: 5 }}>Este servicio será visible inmediatamente en el catálogo de Luminous Noir Boutique tras su edición.</Text>
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