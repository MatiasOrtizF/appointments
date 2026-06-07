import { useRouter } from "expo-router";
import { useEffect } from "react";
import { createGlobalStyles } from "../../../../theme/globalStyles";
import { useTheme } from "../../../../data/provider/ThemeProvider";
import { darkColors, lightColors } from "../../../../theme/colors";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
import LoadingScreen from "../../../../shared/LoadingScreen";
import { FlatList, View, Text, ListRenderItem, RefreshControl, Pressable } from "react-native";
import { Service } from "../../../../domain/models/service/Service";
import { useServiceAdmin } from "./useServiceAdmin";
import { ServiceAdminCard } from "./ServiceAdminCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

export default function ServiceAdminScreen() {
    const { services,
        loading,
        success,
        error,
        refreshing,
        onRefresh,
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

        if (success) {
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Service deleted successfully',
            })
        }
    }, [error, success])

    if (loading) {
        return (
            <LoadingScreen />
        )
    }

    const navigateToAddService = () => {
        router.push("/bottom/admin/add-service")
    }

    const renderEmpty = () => {
        if (services != null) {
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
            onDelete={deleteService}
        />
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList<Service>
                data={services}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={globalStyles.container}
                contentContainerStyle={{ paddingBottom: tabBarHeight, gap: 20 }}
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

            <Pressable
                onPress={() => navigateToAddService()}
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    backgroundColor: colors.primary,
                    borderRadius: 30,
                    width: 55,
                    height: 55,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 5, // Android sombra
                    shadowColor: "#000", // iOS sombra
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                }}
            >
                <Ionicons name="add" size={30} color="#000" />
            </Pressable>
        </View>
    )
}