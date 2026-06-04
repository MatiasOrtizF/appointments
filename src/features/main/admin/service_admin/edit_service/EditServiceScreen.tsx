import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { View, Text, ScrollView, Pressable, Image, TextInput, FlatList, TouchableOpacity } from "react-native";
import { Day, Employee } from "../../../../../domain/models/Service";
import TimeSelector from "../add_service/TimeSelector";
import { Ionicons } from "@expo/vector-icons";
import Divider from "../../../../../shared/Divider";
import LoadingButton from "../../../../../shared/LoadingButton";
import TimePickerModal from "../add_service/TimePickerModal";
import { useTheme } from "../../../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../../../theme/globalStyles";
import { darkColors, lightColors } from "../../../../../theme/colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useEditService } from "./useEditService";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../../../../utils/capitalizeFirstLetter";
import { ServiceCard } from "../../../select_service/ServiceCard";
import { DAYS } from "../../../../../utils/getMissingDaysIndexes";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";

type Params = {
    id: string
    img: string
    name: string
    description: string
    duration_min: string
    price: string
    employees: string
    hourStart: string
    hourEnd: string,
    days: string
}

export default function EditServiceScreen() {
    const [visible, setVisible] = useState(false);
    const [editingType, setEditingType] = useState<"start" | "end">("start");

    const {
        id,
        img: initialImg,
        name: initialName,
        description: initialDescription,
        duration_min: initialDuration,
        price: initialPrice,
        employees: initialEmployees,
        hourStart: initialHourStart,
        hourEnd: initialHourEnd,
        days: initialDays
    } = useLocalSearchParams<Params>()

    const {
        previewService,
        setServiceId,
        image, setImage,
        title, setTitle,
        description, setDescription,
        price, setPrice,
        duration, setDuration,
        selectedEmployees, setSelectedEmployees,
        days, setDays,
        hourStart, setHourStart,
        hourEnd, setHourEnd,
        employees, setEmployees,
        previewVisibility,
        isAdmin,
        editingService,
        loading,
        success,
        error,
        editService,
        toggleSelectedDay,
        toggleSelectedEmployee
    } = useEditService()

    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)

    const colors = isDarkMode ? darkColors : lightColors
    const navigation = useNavigation()

    const tabBarHeight = useBottomTabBarHeight();

    useEffect(() => {
        setServiceId(id)
        setImage(initialImg)
        setTitle(initialName)
        setDescription(initialDescription)
        setPrice(Number(initialPrice))
        setDuration(Number(initialDuration))
        setHourStart(initialHourStart)
        setHourEnd(initialHourEnd)

        if (initialDays) {
            setDays(JSON.parse(initialDays))
        }
        if (initialEmployees) {
            const parsedEmployees = JSON.parse(initialEmployees)

            const employeeIds = parsedEmployees.map(
                (employee: Employee) => employee.id
            )

            setSelectedEmployees(employeeIds)
        }
    }, [])


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
                title: 'Servicio Modificado!',
                textBody: 'Puedes ver todos tus servicios en la seccion de admin',
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

    const handleEditService = () => {
        editService()
    }

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
                            <Text style={globalStyles.label}>Service name</Text>
                            <TextInput
                                placeholder="Titulo para servicio"
                                placeholderTextColor={colors.secondary}
                                value={title}
                                onChangeText={setTitle}
                                autoCapitalize="none"
                                keyboardType="default"
                                style={globalStyles.textInput}
                            />
                        </View>

                        {/*Descripcion*/}
                        <View>
                            <Text style={globalStyles.label}>description</Text>
                            <TextInput
                                placeholder="Descripcion para servicio"
                                placeholderTextColor={colors.secondary}
                                value={description}
                                onChangeText={setDescription}
                                autoCapitalize="none"
                                keyboardType="default"
                                style={globalStyles.textInput}
                            />
                        </View>

                        {/*Precio y Duracion*/}
                        <View style={globalStyles.formRow}>

                            <View style={{ flex: 1 }}>
                                <Text style={globalStyles.label}>precio (ars)</Text>
                                <TextInput
                                    placeholder="Precio"
                                    placeholderTextColor={colors.secondary}
                                    value={price !== null ? price.toString() : ""}
                                    onChangeText={(text) => {
                                        const parsed = parseFloat(text);
                                        setPrice(isNaN(parsed) ? null : parsed);
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="numeric"
                                    style={globalStyles.textInput}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={globalStyles.label}>Duracion (min)</Text>
                                <TextInput
                                    placeholder="Duracion"
                                    placeholderTextColor={colors.secondary}
                                    value={duration !== null ? duration.toString() : ""}
                                    onChangeText={(text) => {
                                        const parsed = parseFloat(text);
                                        setDuration(isNaN(parsed) ? null : parsed);
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="numeric"
                                    style={globalStyles.textInput}
                                />
                            </View>
                        </View>

                        {/* Hora de inicio y finalizacion */}
                        <View style={globalStyles.formRow}>
                            <TimeSelector
                                label="Start hour"
                                value={hourStart}
                                colors={colors}
                                onPress={() => {
                                    setEditingType("start");
                                    setVisible(true);
                                }}
                            />

                            <TimeSelector
                                label="End hour"
                                value={hourEnd}
                                colors={colors}
                                onPress={() => {
                                    setEditingType("end");
                                    setVisible(true);
                                }}
                            />
                        </View>

                        {/*Empleados*/}
                        <View>
                            <Text style={globalStyles.label}>Asignar empleados</Text>
                            <FlatList<Employee>
                                data={employees}
                                horizontal
                                keyExtractor={(employee: Employee) => employee.id.toString()}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 12 }}
                                renderItem={({ item: employee }) => {
                                    const isSelected = selectedEmployees.includes(employee.id);

                                    return (
                                        <Pressable
                                            key={employee.id}
                                            style={{
                                                opacity: isSelected ? 1 : 0.5,
                                                transform: [{ scale: isSelected ? 1 : 0.95 }],
                                            }}
                                            onPress={() => toggleSelectedEmployee(employee.id)}>
                                            <Image style={[globalStyles.imageEmployee, {
                                                borderWidth: 3,
                                                borderColor: isSelected ? colors.primary : colors.textSecondary,
                                            }]} source={{ uri: employee.img }} />

                                            <Text style={[
                                                isSelected
                                                    ? { fontWeight: '600' }
                                                    : { fontWeight: '500' },
                                                globalStyles.textEmployee, { textAlign: "center" }
                                            ]}>{employee.name}</Text>

                                            {isSelected && (
                                                <Ionicons style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    right: 0
                                                }} name="checkmark-circle" size={20} color="black" />
                                            )}

                                        </Pressable>
                                    )
                                }
                                }
                            />
                        </View>

                        <View>
                            <Text style={globalStyles.label}>Dias disponibles</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    flexWrap: "wrap",
                                    gap: 10,
                                }}
                            >
                                {DAYS.map((day) => {
                                    const isSelected = days.includes(day);

                                    return (
                                        <Pressable
                                            key={day}
                                            style={{
                                                backgroundColor: isSelected ? colors.primary : colors.background,
                                                paddingHorizontal: 16,
                                                paddingVertical: 10,
                                                borderRadius: 12,
                                            }}
                                            onPress={() => toggleSelectedDay(day)}
                                        >
                                            <Text
                                                style={{
                                                    color: !isSelected ? colors.textPrimary : colors.background,
                                                    fontWeight: isSelected ? '600' : '400'
                                                }}
                                            >{capitalizeFirstLetter(day)}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>

                        <Divider />

                        <View>
                            <Text style={{ fontWeight: '700', color: colors.textPrimary, textTransform: "uppercase" }}>Visibilidad de la pantalla</Text>
                            <Text style={{ color: colors.textSecondary, marginTop: 5 }}>Este servicio será visible inmediatamente en el catálogo de Luminous Noir Boutique tras su edición.</Text>
                        </View>

                        <TouchableOpacity style={[globalStyles.primaryButton]} onPress={() => handleEditService()} disabled={editingService} >
                            {editingService ? (
                                <LoadingButton />
                            ) : (
                                <Text style={globalStyles.primaryButtonText}>Guardar cambios</Text>
                            )
                            }
                        </TouchableOpacity>
                    </View>
                    {
                        previewVisibility && previewService ?
                            <View>
                                <Text style={{ fontWeight: '700', color: colors.textPrimary, textTransform: "uppercase", marginBottom: 7 }}>Preview</Text>
                                <ServiceCard
                                    service={previewService}
                                    onBook={() => { console.log("veo que hago aca") }}
                                />
                            </View>
                            :
                            null
                    }
                </View>
            </ScrollView>

            <TimePickerModal
                selectedHourDefault={editingType === "start"
                    ? hourStart ? hourStart.slice(0, 2) : "01"
                    : hourEnd?.slice(0, 2) ?? "01"
                }
                selectedMinuteDefault={
                    editingType === "start"
                        ? hourStart?.slice(-2) ?? "01"
                        : hourEnd?.slice(-2) ?? "01"
                }
                visible={visible}
                onClose={() => setVisible(false)}
                onConfirm={(selectedTime) => {
                    if (editingType === "start") {
                        setHourStart(selectedTime);
                    } else {
                        setHourEnd(selectedTime);
                    }

                    setVisible(false);
                }}
            />
        </View>
    )
}