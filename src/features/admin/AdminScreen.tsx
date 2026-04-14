import { Text, StyleSheet, View, Pressable, ScrollView } from "react-native";
import { useAdmin } from "./useAdmin";
import { AdminCard } from "./AdminCard";
import { Ionicons } from "@expo/vector-icons";
import { lightColors, darkColors } from "../../theme/colors";
import { createGlobalStyles } from "../../theme/globalStyles";
import { useTheme } from "../../data/provider/ThemeProvider";
import LoadingScreen from "../../shared/LoadingScreen";
import { useRouter } from "expo-router";
import { Colors } from "../../theme/types";

type Props = {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    isCurrency?: boolean;
    value: number;
    change: number;
    colors: Colors;
};

export default function AdminScreen() {
    const { upcommingAdminAppointments, isAdmin, loading } = useAdmin()
    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors
    const router = useRouter();

    if (loading) {
        <LoadingScreen />
    }

    if (!isAdmin) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", padding: 20}}>
                <Text style={{color: colors.textPrimary, textAlign: "center"}}>Solamente los admins pueden acceder a esta informacion</Text>
            </View>
        )
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ flexGrow: 1 }}
        >

            <View style={styles.dashboardSection}>
                {/* Empresa */}
                <Text style={[styles.companyName, { color: colors.textPrimary }]}>
                    Barber Studio
                </Text>

                {/* Dia + citas */}
                <Text style={styles.dayInfo}>
                    Monday • 8 appointments today
                </Text>

                {/* Greeting */}
                <View style={styles.greetingRow}>
                    <Text style={[styles.greeting, { color: colors.textPrimary }]}>
                        Good Morning,
                    </Text>
                    <Text style={[styles.adminName, { color: colors.textPrimary }]}>
                        Admin
                    </Text>
                    <Ionicons name="sunny" size={20} color="orange" />
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>

                    <StatCard
                        iconName={"calendar-outline"}
                        title={"Bookings"}
                        isCurrency={false}
                        value={8}
                        change={10}
                        colors={colors}
                    />

                    <StatCard
                        iconName={"cash-outline"}
                        title={"Revenue"}
                        isCurrency={true}
                        value={320}
                        change={5}
                        colors={colors}
                    />

                </View>

                {/* Acciones */}
                <View style={styles.actionsRow}>

                    <Pressable style={[globalStyles.primaryButton, styles.newBooking]} onPress={() => console.log("new booking")}>
                        <Ionicons name="add-outline" size={20} color="black" />
                        <Text style={globalStyles.primaryButtonText}>New Booking</Text>
                    </Pressable>

                    <Pressable style={[styles.iconButton, { backgroundColor: colors.bgCard }]} onPress={() => console.log("editar")}>
                        <Ionicons name="pencil-outline" size={22} color={colors.textPrimary} />
                    </Pressable>

                    <Pressable style={[styles.iconButton, { backgroundColor: colors.bgCard }]} onPress={() => console.log("admins")}>
                        <Ionicons name="people-outline" size={22} color={colors.textPrimary} />
                    </Pressable>

                </View>

            </View>

            {/* Turnos cercanos */}
            <View style={[styles.upcomingSection, { backgroundColor: colors.bgSection }]}>
                <View style={[styles.upcomingRow]}>
                    <Text style={[styles.subTitle, { color: colors.textPrimary }]}>
                        Upcoming schedule
                    </Text>

                    <Pressable onPress={() => router.push("/bottom/admin/appointment-admin")}>
                        <Text style={{ color: colors.textSecondary }}>See all</Text>
                    </Pressable>
                </View>

                {upcommingAdminAppointments.map((appointment) => (
                    <AdminCard
                        key={appointment.id}
                        appointment={appointment}
                    />
                ))}

            </View>


        </ScrollView>
    )

}

const StatCard: React.FC<Props> = ({ iconName, title, isCurrency, value, change, colors }) => {
    const formattedValue = isCurrency ? `$${value}` : value;

    return (
        <View style={[styles.statCard, { backgroundColor: colors.bgCard }]}>
            <View style={styles.statIcon}>
                <Ionicons name={iconName} size={22} color={colors.secondary} />
            </View>
            <Text style={{ color: colors.textPrimary }}>{title}</Text>
            <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{formattedValue}</Text>
                <Text style={styles.statChange}>+{change}%</Text>
            </View>

        </View>
    )
}

export const styles = StyleSheet.create({

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
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 4,

        elevation: 3, // android
        shadowColor: "#000", // ios
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },

    statIcon: {
        //backgroundColor: colors.primaryLight,
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
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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