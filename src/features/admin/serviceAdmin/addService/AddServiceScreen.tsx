import * as ImagePicker from "expo-image-picker";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Pressable, Image, FlatList } from "react-native";
import { useTheme } from "../../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../../theme/globalStyles";
import { darkColors, lightColors } from "../../../../theme/colors";
import { useNavigation, useRouter } from "expo-router";
import { useAddService } from "./useAddService";
import LoadingButton from "../../../../shared/LoadingButton";
import Divider from "../../../../shared/Divider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Day, Employee } from "../../../../domain/models/Service";
import { useEffect, useState } from "react";
import { ServiceCard } from "../../../selectService/ServiceCard";
import LoadingScreen from "../../../../shared/LoadingScreen";
import { Ionicons } from "@expo/vector-icons";
import TimePickerModal from "./TimePickerModal";
import TimeSelector from "./TimeSelector";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { DAYS } from "../../../../utils/getMissingDaysIndexes";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";

export default function AddServiceScreen() {

    const [visible, setVisible] = useState(false);
    const [editingType, setEditingType] = useState<"start" | "end">("start");

    const {
        previewService,
        image, setImage,
        title, setTitle,
        description, setDescription,
        price, setPrice,
        duration, setDuration,
        selectedEmployees, setSelectedEmployees,
        days, setDays,
        hourStart, setHourStart,
        hourEnd, setHourEnd,
        employees,
        previewVisibility,
        isAdmin,
        creatingService,
        loading,
        success,
        error,
        addService,
        getHourString
    } = useAddService()
    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)

    const colors = isDarkMode ? darkColors : lightColors
    const styles = createStyles(colors);
    const navigation = useNavigation()
    const router = useRouter();

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
                title: 'Servicio creado',
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

    const tabBarHeight = useBottomTabBarHeight();

    const handleCreateService = () => {
        addService()
    }

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


    const handleSelectEmployee = (employeeId: string) => {
        setSelectedEmployees(prevList =>
            prevList.includes(employeeId)
                ? prevList.filter(item => item !== employeeId) // lo saco
                : [...prevList, employeeId] // lo agrego
        )
    }

    const handleSelectDay = (day: Day) => {
        setDays(prevList =>
            prevList.includes(day)
                ? prevList.filter(item => item !== day) // lo saco
                : [...prevList, day] // lo agrego
        )
    }

    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
                <View style={{ gap: 30, paddingBottom: tabBarHeight }}>
                    <View>
                        <Text style={globalStyles.title}>Create service</Text>
                        <Text style={globalStyles.subTitle}>
                            Define un nuevo servicio para ofrecer a tus clientes. Establece su precio, duración y disponibilidad para gestionar tus turnos de forma eficiente.
                        </Text>
                    </View>
                    <View style={[styles.card, { backgroundColor: colors.bgCard, gap: 20 }]}>

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

                        {/*Titulo*/}
                        <View>
                            <Text style={styles.label}>Service name</Text>
                            <TextInput
                                placeholder="Titulo para servicio"
                                placeholderTextColor={colors.secondary}
                                value={title}
                                onChangeText={setTitle}
                                autoCapitalize="none"
                                keyboardType="default"
                                style={styles.textInput}
                            />
                        </View>

                        {/*Descripcion*/}
                        <View>
                            <Text style={styles.label}>description</Text>
                            <TextInput
                                placeholder="Descripcion para servicio"
                                placeholderTextColor={colors.secondary}
                                value={description}
                                onChangeText={setDescription}
                                autoCapitalize="none"
                                keyboardType="default"
                                style={styles.textInput}
                            />
                        </View>

                        {/*Precio y Duracion*/}
                        <View style={styles.formRow}>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>precio (ars)</Text>
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
                                    style={styles.textInput}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Duracion (min)</Text>
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
                                    style={styles.textInput}
                                />
                            </View>
                        </View>

                        {/* Hora de inicio y finalizacion */}
                        <View style={styles.formRow}>
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
                            <Text style={styles.label}>Asignar empleados</Text>
                            <FlatList<Employee>
                                data={employees}
                                horizontal
                                keyExtractor={(employee: Employee) => employee.id}
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
                                            onPress={() => handleSelectEmployee(employee.id)}>
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
                            <Text style={styles.label}>Dias disponibles</Text>
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
                                            onPress={() => handleSelectDay(day)}
                                        >
                                            <Text
                                                style={{
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
                            <Text style={{ color: colors.textSecondary, marginTop: 5 }}>Este servicio será visible inmediatamente en el catálogo de Luminous Noir Boutique tras su creación.</Text>
                        </View>

                        <TouchableOpacity style={[globalStyles.primaryButton]} onPress={() => handleCreateService()} disabled={creatingService} >
                            {creatingService ? (
                                <LoadingButton />
                            ) : (
                                <Text style={globalStyles.primaryButtonText}>Crear</Text>
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

const createStyles = (colors: any) =>
    StyleSheet.create({
        card: {
            borderRadius: 16,
            padding: 20,
        },

        label: {
            fontWeight: "700",
            color: colors.textSecondary,
            textTransform: "uppercase",
            marginBottom: 10,
        },
        textInput: {
            backgroundColor: colors.background,
            borderRadius: 50,
            height: 50,
            paddingHorizontal: 20,
            fontWeight: '500'
        },
        formRow: {
            flex: 1,
            flexDirection: "row",
            gap: 7
        }
    });