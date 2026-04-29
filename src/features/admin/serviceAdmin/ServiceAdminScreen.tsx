import { useRouter } from "expo-router";
import { useEffect } from "react";
import { createGlobalStyles } from "../../../theme/globalStyles";
import { useTheme } from "../../../data/provider/ThemeProvider";
import { darkColors, lightColors } from "../../../theme/colors";
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import LoadingScreen from "../../../shared/LoadingScreen";
import { FlatList, View, Text, ListRenderItem, RefreshControl } from "react-native";
import { Service } from "../../../domain/models/Service";
import { useServiceAdmin } from "./useServiceAdmin";
import { ServiceAdminCard } from "./ServiceAdminCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function ServiceAdminScreen() {
    const { service,
        loading,
        error,
        refreshing,
        onRefresh,
        addService,
        editService,
        deleteService
    } = useServiceAdmin()
    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors
    const router = useRouter();

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
    }, [error])

    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    const renderEmpty = () => {
        if (service != null) {
            return (
                <View style={globalStyles.container}>
                    <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
                        Todavia no creaste ningun servicio
                    </Text>
                </View>
            )
        }
    }


    const renderItem: ListRenderItem<Service> = ({ item }) => (
        <ServiceAdminCard
            service={item}
            onDelete={() => { deleteService }}
        />
    );

    return (
        <FlatList<Service>
            data={service}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={globalStyles.container}
            contentContainerStyle={{ paddingBottom: tabBarHeight, gap: 12 }}
            ListEmptyComponent={renderEmpty}
            renderItem={renderItem}

            ListHeaderComponent={
                <Text style={globalStyles.title}>Servicios</Text>
            }

            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        />
    )
}