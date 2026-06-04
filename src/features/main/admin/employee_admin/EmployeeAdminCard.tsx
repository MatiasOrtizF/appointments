import { View, Text, Image, StyleSheet, Alert } from "react-native"
import { Employee, Service } from "../../../../domain/models/Service";
import { useTheme } from "../../../../data/provider/ThemeProvider";
import { createAdminAppointmentStyles } from "../../../../theme/adminAppointmentStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { darkColors, lightColors } from "../../../../theme/colors";
import { createGlobalStyles } from "../../../../theme/globalStyles";
import { EMPLOYEE_STATUS_STYLES } from "../../../../constants/statusStyles";

type Props = {
    employee: Employee,
    onDelete: (employeeId: number) => void
}

export const EmployeeAdminCard: React.FC<Props> = ({
    employee,
    onDelete
}) => {
    const { id, img, name, lastName, role, status } = employee
    const statusStyle =
        EMPLOYEE_STATUS_STYLES[status.toLowerCase() as keyof typeof EMPLOYEE_STATUS_STYLES];
    const { isDarkMode } = useTheme();
    const globalStyles = createGlobalStyles(isDarkMode)
    const colors = isDarkMode ? darkColors : lightColors
    const adminAppointmentStyles = createAdminAppointmentStyles(isDarkMode)

    const handleDeleteEmployee = () => {
        Alert.alert(
            "Borrar Empleador",
            "¿Estás seguro de que querés borrar este empleador?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Borrar",
                    style: "destructive",
                    onPress: () => onDelete(id),
                },
            ]
        );
    };

    const navigateToEditEmployee = () => {
        router.push({
            pathname: "/bottom/admin/edit-employee",
            params: {
                id,
                img,
                name,
                lastName,
                role: role,
                status: status
            }
        })
    }

    return (
        <View style={[adminAppointmentStyles.card, { gap: 10 }]}>

            {/* Imagen */}
            <View style={{ justifyContent: "center" }}>
                {img ?
                    <Image source={{ uri: img }} style={{ width: 75, height: 75, borderRadius: 50 }} />
                    :
                    <View
                        style={{
                            width: 75,
                            height: 75,
                            borderRadius: 50,
                            backgroundColor: colors.background,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Ionicons
                            name="person"
                            size={35}
                            color={colors.textSecondary}
                        />
                    </View>
                }
            </View>

            {/* Información */}
            <View style={adminAppointmentStyles.infoContainer}>
                <View style={{ gap: 6 }}>
                    <Text style={adminAppointmentStyles.client}>{name + " " + lastName}</Text>
                    {/*<Text numberOfLines={3} style={adminAppointmentStyles.service}>{name}</Text>*/}
                    <Text
                        style={[
                            adminAppointmentStyles.status,
                            { color: statusStyle.text }
                        ]}
                    >
                        {status}
                    </Text>
                </View>
                {role === "admin" &&
                    <Text style={{ color: "#6a1b9a", fontWeight: '600' }}>Admin</Text>
                }
            </View>

            {/* Estado */}
            <View style={[adminAppointmentStyles.statusContainer, { gap: 25 }]}>
                <Ionicons name="pencil-outline" size={25} color={colors.textSecondary} onPress={() => navigateToEditEmployee()} />
                <Ionicons name="trash-outline" size={25} color={colors.textSecondary} onPress={() => handleDeleteEmployee()} />
            </View>
        </View>
    );
};