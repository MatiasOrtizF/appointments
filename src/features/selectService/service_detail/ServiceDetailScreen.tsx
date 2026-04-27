import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Image, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { useTheme } from "../../../data/provider/ThemeProvider";
import { createGlobalStyles } from "../../../theme/globalStyles";
import { darkColors, lightColors } from "../../../theme/colors";
import { useEffect, useState } from "react";
import { useServiceDetail } from "./useServiceDetail";
import LoadingScreen from "../../../shared/LoadingScreen";
import { Ionicons } from "@expo/vector-icons";
import { Employee } from "../../../domain/models/Service";

export default function ServiceDetailScreen() {
    const { serviceId } = useLocalSearchParams<{ serviceId?: string }>()
    const { service, selectedEmployee, setSelectedEmployee, loading, error, getService } = useServiceDetail()

    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors;

    const router = useRouter();


    useEffect(() => {
        if (serviceId) {
            getService(serviceId)
        }
    }, [])

    if (loading) {
        return <LoadingScreen />
    }

    const navigateToScheduleAppointment = () => {
        const employeeImg = selectedEmployee?.img
        const employeeName = selectedEmployee?.name
        const employeeId = selectedEmployee?.id

        router.push({
            pathname: '/bottom/select-service/schedule-appointment',
            params: { serviceId, employeeImg, employeeName, employeeId }
        })
    }

    const handleSelectEmployee = (employee: Employee) => {
        if (employee.id === selectedEmployee?.id) {
            setSelectedEmployee(null)
        } else {
            setSelectedEmployee(employee)
        }
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={{ position: "relative" }}>
                <Image
                    source={{ uri: service?.img }}
                    style={styles.image}
                />

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.btnArrowBack}
                >
                    <Ionicons
                        name="arrow-back"
                        size={28}
                        color="white"
                    />
                </TouchableOpacity>
            </View>
            <View style={[globalStyles.container, { borderTopStartRadius: 30, borderTopEndRadius: 30, marginTop: -30 }]}>
                <Text style={globalStyles.title}>
                    {service?.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                    <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                    <Text style={[styles.durationText, { color: colors.textSecondary, marginLeft: 5 }]}>
                        {service?.duration_min} min
                    </Text>

                    <Ionicons name="cash-outline" size={20} color={colors.textSecondary} style={{ marginLeft: 15 }} />
                    <Text style={[styles.durationText, { color: colors.textSecondary, marginLeft: 5 }]}>
                        ${service?.price}
                    </Text>
                </View>

                {/* DIVIDER */}
                <View style={{ height: 1, backgroundColor: colors.divider }} />

                <Text style={[globalStyles.subTitle, { color: colors.textPrimary, marginVertical: 10, fontWeight: 600 }]}>Selecciona un empleado</Text>
                <ScrollView horizontal style={{ marginVertical: 7 }}>
                    {service?.employees.map((employee) => (
                        <Pressable
                            key={employee.id}
                            style={{
                                marginHorizontal: 10, alignItems: "center", padding: 6, borderRadius: 12,
                                borderWidth: selectedEmployee?.id === employee.id ? 2 : 0,
                                borderColor: selectedEmployee?.id === employee.id ? colors.secondary : "transparent",
                                backgroundColor: selectedEmployee?.id === employee.id ? colors.secondary + "20" : "transparent"
                            }}
                            onPress={() => handleSelectEmployee(employee)}>
                            <Image style={styles.imageEmployee} source={{ uri: employee.img }} />

                            <Text style={{ color: colors.textPrimary, marginTop: 3 }}>{employee.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
                <Text style={[globalStyles.subTitle, { color: colors.textPrimary, fontWeight: 600 }]}>Acerca de este servicio</Text>
                <Text style={[styles.description, { color: colors.textSecondary, marginVertical: 10 }]}>{service?.description}</Text>
                <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 15, marginTop: 20 }}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ color: colors.textSecondary }}>TOTAL PRICE</Text>
                        <Text style={[styles.price, { color: colors.textPrimary }]}>${service?.price}</Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            globalStyles.primaryButton,
                            !selectedEmployee && styles.buttonDisabled,
                            { flex: 1 }]}
                        disabled={selectedEmployee == null}
                        onPress={() => navigateToScheduleAppointment()}>
                        <Text style={globalStyles.primaryButtonText}>Book Appointment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    image: {
        width: '100%',
        height: 300
    },

    btnArrowBack: {
        position: "absolute",
        top: 24,
        left: 24,
        backgroundColor: "rgba(0,0,0,0.35)",
        padding: 10,
        borderRadius: 999
    },

    durationText: {
        fontWeight: '600',
        marginLeft: 3,
        fontSize: 13,
    },

    imageEmployee: {
        borderRadius: 50,
        width: 50,
        height: 50
    },

    description: {
        marginTop: 5,
        marginBottom: 10,
        fontSize: 14,
    },

    price: {
        fontWeight: "700",
        fontSize: 20
    },
    buttonDisabled: {
        opacity: 0.5,
    },
})