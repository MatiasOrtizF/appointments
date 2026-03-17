import { Text, StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useAdmin } from "./useAdmin";
import { AdminCard } from "./AdminCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { globalStyles } from "../../theme/globalStyles";

export default function AdminScreen() {

    const { upcommingAppointments, loading } = useAdmin()

    if (loading) {
        return <Text>Loading...</Text>
    }

    type NavigationProp = NativeStackNavigationProp<
        MainStackParamList,
        "AdminAppointments"
    >;

    const navigation = useNavigation<NavigationProp>();

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}
        >

            <View style={styles.dashboardSection}>
                {/* Empresa */}
                <Text style={styles.companyName}>
                    Barber Studio
                </Text>

                {/* Dia + citas */}
                <Text style={styles.dayInfo}>
                    Monday • 8 appointments today
                </Text>

                {/* Greeting */}
                <View style={styles.greetingRow}>
                    <Text style={styles.greeting}>
                        Good Morning,
                    </Text>
                    <Text style={styles.adminName}>
                        Admin
                    </Text>
                    <Ionicons name="sunny" size={20} color="orange" />
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>

                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <Ionicons name="calendar-outline" size={22} color={colors.secondary} />
                        </View>
                        <Text>Bookings</Text>
                        <View style={styles.statValueRow}>
                            <Text style={styles.statValue}>8</Text>
                            <Text style={styles.statChange}>+10%</Text>
                        </View>

                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statIcon}>
                            <Ionicons name="cash-outline" size={22} color={colors.secondary} />
                        </View>
                        <Text>Revenue</Text>
                        <View style={styles.statValueRow}>
                            <Text style={styles.statValue}>$320</Text>
                            <Text style={styles.statChange}>+5%</Text>
                        </View>
                    </View>

                </View>

                {/* Acciones */}
                <View style={styles.actionsRow}>

                    <Pressable style={[globalStyles.primaryButton, styles.newBooking]} onPress={() => console.log("new booking")}>
                        <Ionicons name="add-outline" size={20} color="black" />
                        <Text style={globalStyles.primaryButtonText}>New Booking</Text>
                    </Pressable>

                    <Pressable style={styles.iconButton} onPress={() => console.log("editar")}>
                        <Ionicons name="pencil-outline" size={22} />
                    </Pressable>

                    <Pressable style={styles.iconButton} onPress={() => console.log("admins")}>
                        <Ionicons name="people-outline" size={22} />
                    </Pressable>

                </View>

            </View>

            {/* Turnos cercanos */}
            <View style={styles.upcomingSection}>
                <View style={styles.upcomingRow}>
                    <Text style={styles.subTitle}>
                        Upcoming schedule
                    </Text>

                    <Pressable onPress={() => navigation.navigate("AdminAppointments")}>
                        <Text>See all</Text>
                    </Pressable>
                </View>

                {upcommingAppointments.map((appointment) => (
                    <AdminCard
                        key={appointment.id}
                        appointment={appointment}
                        onCancel={() => { }}
                    />
                ))}

            </View>


        </ScrollView>
    )

}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f6fa",
    },

    dashboardSection: {
        paddingTop: 30,
        paddingHorizontal: 20,
    },

    companyName: {
        fontSize: 27,
        fontWeight: "700",
        marginBottom: 4,
    },

    dayInfo: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 16,
    },

    greetingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 20,
    },

    greeting: {
        fontSize: 16,
        fontWeight: "500",
    },

    adminName: {
        fontSize: 16,
        fontWeight: "700",
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    statCard: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,

        elevation: 3, // android
        shadowColor: "#000", // ios
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },

    statIcon: {
        backgroundColor: colors.primaryLight,
        padding: 10,
        borderRadius: 50,
        alignSelf: "flex-start",
        marginBottom: 10
    },

    statValueRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },

    statValue: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 4,
    },

    statChange: {
        color: "green",
        fontWeight: "700",
    },

    actionsRow: {
        flexDirection: "row",
        marginBottom: 24,
        gap: 10,
    },

    newBooking: {
        flex: 1,
        flexDirection: "row",
        gap: 6,
    },

    iconButton: {
        backgroundColor: "white",
        height: 50,
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        borderWidth: 0.2,
        borderColor: "gray",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },

    upcomingSection: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 30,
    },

    upcomingRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    subTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },

});