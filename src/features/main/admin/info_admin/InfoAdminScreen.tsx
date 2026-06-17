import { View, Text, ScrollView, Pressable, Image, TextInput, StyleSheet, FlatList, TouchableOpacity, Switch } from "react-native";
import { useInfoAdmin } from "./useInfoAdmin";
import { useEffect, useState } from "react";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { useTheme } from "../../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../../theme/globalStyles";
import { darkColors, lightColors } from "../../../../theme/colors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import LoadingButton from "../../../../shared/components/LoadingButton";
import { capitalizeFirstLetter } from "../../../../utils/capitalizeFirstLetter";
import LoadingScreen from "../../../../shared/components/LoadingScreen";
import { BusinessHour, paymentMethods } from "../../../../domain/models/business_info/BusinessInfo";
import { router } from "expo-router";
import TimePickerModal from "../service_admin/add_service/TimePickerModal";

interface CreateBusinessHour {
    dayOfWeek: number;
    dayName: string;
    enabled: boolean;
    openTime: string;
    closeTime: string;
}

export default function InfoAdminScreen() {
    const {
        info,
        newPaymentMethods, setNewPaymentMethods,
        newCancellationPolicy, setNewCancellationPolicy,
        newChatbotContext, setNewChatbotContext,
        newBusinessHours, setNewBusinessHours,
        businessHours, setBusinessHours,
        editingInfo, setEditingInfo,
        loading,
        success,
        error, setError,
        editBusinessInfo,
        toggleSelectedMethod,
        toggleDay
    } = useInfoAdmin()

    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)

    const colors = isDarkMode ? darkColors : lightColors

    const tabBarHeight = useBottomTabBarHeight();

    const [visible, setVisible] = useState(false);

    const [editingType, setEditingType] = useState<"start" | "end">("start");

    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

    const openPicker = (
        dayIndex: number,
        type: "start" | "end"
    ) => {
        setSelectedDayIndex(dayIndex);
        setEditingType(type);
        setVisible(true);
    };

    const selectedDay =
        selectedDayIndex !== null
            ? businessHours[selectedDayIndex]
            : null;

    useEffect(() => {
        if (error) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: error,
                button: "Cerrar",
                closeOnOverlayTap: false,
                onPressButton: () => {
                    Dialog.hide()
                    setError(null)
                }
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
                    router.back();
                },
            });
        }
    }, [error, success])

    if (loading || info == null) {
        <LoadingScreen />
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
                <View style={{ gap: 30, paddingBottom: tabBarHeight }}>
                    <View>
                        <Text style={globalStyles.title}>Editar Negocio</Text>
                        <Text style={globalStyles.subTitle}>
                            Edita la información de tu negocio. Modifica las politicas de cancelación, contextos, metodos de pagos y horarios para gestionar el asistente virutal de forma eficiente.</Text>
                    </View>
                    <View style={[globalStyles.card, { position: "relative" }]}>

                        {/*Politicas de cancelacion*/}
                        <View>
                            <Text style={globalStyles.label}>Política de cancelación</Text>
                            <TextInput
                                multiline
                                textAlignVertical="top"
                                placeholder="Titulo para servicio"
                                placeholderTextColor={colors.secondary}
                                value={newCancellationPolicy}
                                onChangeText={setNewCancellationPolicy}
                                autoCapitalize="none"
                                keyboardType="default"
                                style={[globalStyles.textInput, { height: 120, borderRadius: 15 }]}
                            />
                        </View>

                        {/*Chatbot Context*/}
                        <View>
                            <Text style={globalStyles.label}>Información adicional para el chatbot</Text>
                            <TextInput
                                multiline
                                textAlignVertical="top"
                                placeholder="Descripcion para servicio"
                                placeholderTextColor={colors.secondary}
                                value={newChatbotContext}
                                onChangeText={setNewChatbotContext}
                                autoCapitalize="none"
                                keyboardType="default"
                                style={[globalStyles.textInput, { height: 120, borderRadius: 15 }]}
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
                                {Object.values(paymentMethods).map((method) => {
                                    const isSelected = newPaymentMethods.includes(method);

                                    return (
                                        <Pressable
                                            key={method}
                                            style={{
                                                backgroundColor: isSelected ? colors.primary : colors.background,
                                                paddingHorizontal: 16,
                                                paddingVertical: 10,
                                                borderRadius: 12,
                                            }}
                                            onPress={() => toggleSelectedMethod(method)}
                                        >
                                            <Text
                                                style={{
                                                    color: !isSelected ? colors.textPrimary : colors.background,
                                                    fontWeight: isSelected ? '600' : '400'
                                                }}
                                            >{capitalizeFirstLetter(method)}</Text>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>

                        <View>
                            <Text style={globalStyles.label}>Horarios</Text>
                            <View
                                style={{
                                    gap: 10,
                                }}
                            >
                                {businessHours.map((day, index) => (
                                    <View
                                        key={day.dayOfWeek}

                                    >
                                        <TouchableOpacity
                                            style={styles.dayContainer}
                                            onPress={() => toggleDay(index)}
                                        >
                                            <Text style={{ color: colors.primary, fontSize: 20, marginRight: 6 }}>
                                                {day.enabled ? "☑" : "☐"}
                                            </Text>

                                            <Text style={globalStyles.hourText}>
                                                {day.dayName}
                                            </Text>
                                        </TouchableOpacity>

                                        {day.enabled ? (
                                            <View style={{ flexDirection: "row", alignItems: "center"}}>

                                                <TouchableOpacity
                                                    onPress={() =>
                                                        openPicker(index, "start")
                                                    }
                                                >
                                                    <Text style={globalStyles.hourText}>
                                                        {day.openTime}
                                                    </Text>
                                                </TouchableOpacity>

                                                <Text style={[globalStyles.hourText, {marginHorizontal: 6}]}>
                                                    →
                                                </Text>

                                                <TouchableOpacity
                                                    onPress={() =>
                                                        openPicker(index, "end")
                                                    }
                                                >
                                                    <Text style={globalStyles.hourText}>
                                                        {day.closeTime}
                                                    </Text>
                                                </TouchableOpacity>

                                            </View>
                                        ) : (
                                            <Text style={{ color: colors.textSecondary }}>
                                                Cerrado
                                            </Text>
                                        )}
                                    </View>
                                ))}

                            </View>
                        </View>

                        <TouchableOpacity style={[globalStyles.primaryButton]} onPress={() => editBusinessInfo()} disabled={editingInfo} >
                            {editingInfo ? (
                                <LoadingButton />
                            ) : (
                                <Text style={globalStyles.primaryButtonText}>Guardar cambios</Text>
                            )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <TimePickerModal
                visible={visible}
                selectedHourDefault={
                    editingType === "start"
                        ? selectedDay?.openTime.slice(0, 2) ?? "09"
                        : selectedDay?.closeTime.slice(0, 2) ?? "18"
                }
                selectedMinuteDefault={
                    editingType === "start"
                        ? selectedDay?.openTime.slice(-2) ?? "00"
                        : selectedDay?.closeTime.slice(-2) ?? "00"
                }
                onClose={() => setVisible(false)}
                onConfirm={(selectedTime) => {

                    if (selectedDayIndex === null) {
                        return;
                    }

                    setBusinessHours(prev =>
                        prev.map((day, index) => {

                            if (index !== selectedDayIndex) {
                                return day;
                            }

                            return {
                                ...day,
                                openTime:
                                    editingType === "start"
                                        ? selectedTime
                                        : day.openTime,

                                closeTime:
                                    editingType === "end"
                                        ? selectedTime
                                        : day.closeTime,
                            };
                        })
                    );

                    setVisible(false);
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#ECECEC",
    },

    dayContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    checkbox: {
        fontSize: 18,
    },

    dayName: {
        marginLeft: 10,
        fontSize: 16,
    },

    hoursContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    time: {
        fontSize: 16,
        fontWeight: "500",
    },

    arrow: {
        marginHorizontal: 8,
        fontSize: 16,
    },

    closed: {
        color: "#888",
        fontStyle: "italic",
    },
});