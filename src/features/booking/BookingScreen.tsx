import { FlatList, Text, View, StyleSheet, ListRenderItem, Pressable, RefreshControl } from "react-native";
import { PastBookingCard } from "./PastBookingCard";
import { Appointment } from "../../domain/models/Appointment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { UpcomingBookingCard } from "./UpcomingBookingCard";
import { useBooking } from "./useBooking";
import { lightColors, darkColors } from "../../theme/colors";
import { createGlobalStyles } from "../../theme/globalStyles";
import { useTheme } from "../../data/provider/ThemeProvider";
import { Colors } from "../../theme/types";
import LoadingScreen from "../../shared/LoadingScreen";

type Props = {
    tab: "upcoming" | "past";
    setTab: React.Dispatch<React.SetStateAction<"upcoming" | "past">>;
    globalStyles: ReturnType<typeof createGlobalStyles>;
    colors: Colors;
};

export default function BookingScreen() {
    const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
    const { isDarkMode } = useTheme();
    const globalStyles: ReturnType<typeof createGlobalStyles> = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors

    const { pastAppointments, upcommingAppointments, loading, refreshing, onRefresh } = useBooking()

    if (loading) {
        return <LoadingScreen />
    }

    const data =
        tab === "upcoming" ? upcommingAppointments : pastAppointments

    const renderItem: ListRenderItem<Appointment> = ({ item }) => (
        tab === "upcoming" ? (
            <UpcomingBookingCard
                appointment={item}
            />
        ) : (
            <PastBookingCard
                appointment={item}
            />
        )
    );


    const renderEmpty = () => {
        const message =
            tab === "upcoming"
                ? "No tenés turnos próximos"
                : "No tenés turnos anteriores"

        return (
            <View style={{ alignItems: "center", marginTop: 40 }}>
                <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
                    {message}
                </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <FlatList<Appointment>
                data={tab === "upcoming" ? upcommingAppointments : pastAppointments}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 24, paddingBottom: 16 }}

                ListHeaderComponent={
                    <BookingHeader
                        tab={tab}
                        setTab={setTab}
                        globalStyles={globalStyles}
                        colors={colors}
                    />
                }

                ListEmptyComponent={renderEmpty}
                renderItem={renderItem}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={()=> onRefresh(tab)}
                    />
                }
            />
        </SafeAreaView>
    )
}

const BookingHeader = ({ tab, setTab, globalStyles, colors }: Props) => {
    return (
        <View style={[styles.tabsContainer, { backgroundColor: colors.bgCard }]}>
            <Pressable
                style={[
                    styles.tab,
                    tab === "upcoming" && { backgroundColor: colors.primary }
                ]}
                onPress={() => setTab("upcoming")}
            >
                <Text
                    style={[
                        styles.tabText, { color: colors.textPrimary },
                        tab === "upcoming" && globalStyles.primaryButtonText
                    ]}
                >
                    Upcoming
                </Text>
            </Pressable>

            <Pressable
                style={[
                    styles.tab,
                    tab === "past" && { backgroundColor: colors.primary }
                ]}
                onPress={() => setTab("past")}
            >
                <Text
                    style={[
                        styles.tabText, { color: colors.textPrimary },
                        tab === "past" && globalStyles.primaryButtonText
                    ]}
                >
                    Past
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: "row",
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

    tabText: {
        fontWeight: "500",
        fontSize: 16,
    },
})