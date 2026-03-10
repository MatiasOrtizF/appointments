import { FlatList, Text, View, StyleSheet, ListRenderItem, Pressable } from "react-native";
import { useBooking } from "./UseBooking";
import { PastBookingCard } from "./PastBookingCard";
import { Appointment } from "../../domain/models/Appointment";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme/Colors";
import { useState } from "react";
import { UpcomingBookingCard } from "./UpcomingBookingCard";

export default function BookingScreen() {
    const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

    const { pastAppointments, upcommingAppointments, loading } = useBooking()

    if (loading) {
        return <Text>Loading...</Text>
    }

    const renderItem: ListRenderItem<Appointment> = ({ item }) => (
        tab === "upcoming" ? (
            <UpcomingBookingCard
                appointment={item}
                onCancel={(appointmentId) => console.log("borrar " + appointmentId)}
            />
        ) : (
            <PastBookingCard
                appointment={item}
                onCancel={(appointmentId) => console.log("borrar " + appointmentId)}
            />
        )
    );

    return (
        <SafeAreaView>
            <FlatList<Appointment>
                data={pastAppointments}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 24, paddingBottom: 16 }}

                ListHeaderComponent={
                    <View style={styles.tabsContainer}>
                        <Pressable
                            style={[
                                styles.tab,
                                tab === "upcoming" && styles.activeTab
                            ]}
                            onPress={() => setTab("upcoming")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    tab === "upcoming" && styles.activeTabText
                                ]}
                            >
                                Upcoming
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.tab,
                                tab === "past" && styles.activeTab
                            ]}
                            onPress={() => setTab("past")}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    tab === "past" && styles.activeTabText
                                ]}
                            >
                                Past
                            </Text>
                        </Pressable>
                    </View>
                }

                renderItem={renderItem}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 50,
        padding: 5,
        marginBottom: 25
    },

    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 50
    },

    activeTab: {
        backgroundColor: "yellow"
    },

    tabText: {
        color: "#777",
        fontWeight: "500"
    },

    activeTabText: {
        color: "#000",
        fontWeight: "600"
    }
})