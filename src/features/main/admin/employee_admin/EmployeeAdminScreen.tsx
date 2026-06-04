import { useRouter } from "expo-router";
import { useTheme } from "../../../../data/provider/ThemeProvider";
import { darkColors, lightColors } from "../../../../theme/colors";
import { createGlobalStyles } from "../../../../theme/globalStyles";
import { useEmployeeAdmin } from "./useEmployeeAdmin";
import { FlatList, ListRenderItem, Pressable, RefreshControl, Text, View } from "react-native";
import { useEffect } from "react";
import { ALERT_TYPE, Dialog, Toast } from "react-native-alert-notification";
import LoadingScreen from "../../../../shared/LoadingScreen";
import { Employee } from "../../../../domain/models/Service";
import { EmployeeAdminCard } from "./EmployeeAdminCard";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function EmployeeAdminScreen() {
    const { employees,
        loading,
        success,
        error,
        refreshing,
        onRefresh,
        deleteEmployee
    } = useEmployeeAdmin()
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
        router.push("/bottom/admin/add-employee")
    }

    const renderEmpty = () => {
        if (employees != null) {
            return (
                <View style={globalStyles.container}>
                    <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
                        Todavia no tenes ningun empleador cargado
                    </Text>
                </View>
            )
        }
    }

    const renderItem: ListRenderItem<Employee> = ({ item }) => (
        <EmployeeAdminCard
            employee={item}
            onDelete={deleteEmployee}
        />
    );


    return (
        <View style={{ flex: 1 }}>
            <FlatList<Employee>
                data={employees}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                style={globalStyles.container}
                contentContainerStyle={{ paddingBottom: tabBarHeight, gap: 12 }}
                ListEmptyComponent={renderEmpty}
                renderItem={renderItem}

                ListHeaderComponent={
                    <Text style={globalStyles.title}>Empleados</Text>
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