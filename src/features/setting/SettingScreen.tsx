import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSetting } from "./useSetting";
import { useTheme } from "../../data/provider/ThemeProvider";
import { useRouter } from "expo-router";
import { createGlobalStyles } from "../../theme/globalStyles";
import { darkColors, lightColors } from "../../theme/colors";

export const SettingsScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true)

  const { isDarkMode, toggleTheme } = useTheme();
  const globalStyles = createGlobalStyles(isDarkMode)
   const colors = isDarkMode ? darkColors : lightColors;

  const {
    logOut,
    loading,
    error
  } = useSetting();

  const SettingItem = ({
    icon,
    title,
    onPress,
    rightComponent
  }: any) => {

    return (
      <TouchableOpacity style={[styles.item, {backgroundColor: colors.bgCard}]} onPress={onPress} activeOpacity={0.7}>

        <View style={styles.leftSection}>
          <Ionicons name={icon} size={22} color={colors.textSecondary} />
          <Text style={[styles.itemText, {color: colors.textPrimary}]}>{title}</Text>
        </View>

        {rightComponent ? (
          rightComponent
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#999" />
        )}

      </TouchableOpacity>
    )
  }

  return (

    <ScrollView style={ globalStyles.container }>

      <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>Profile</Text>

      <SettingItem
        icon="person-outline"
        title="Edit profile"
        onPress={() => { }}
      />

      <SettingItem
        icon="lock-closed-outline"
        title="Change password"
        onPress={() => router.push("/bottom/settings/change-password")}
      />



      <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>Appearance</Text>

      <SettingItem
        icon="moon-outline"
        title="Dark mode"
        rightComponent={
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
          />
        }
      />



      <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>Notifications</Text>

      <SettingItem
        icon="notifications-outline"
        title="Appointment reminders"
        rightComponent={
          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        }
      />

      <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>Account</Text>

      <SettingItem
        icon="log-out-outline"
        title="Logout"
        onPress={()=> handleLogOut(logOut)}
      />

    </ScrollView>
  )
}

const handleLogOut = (onLogOut: () => void) => {
  Alert.alert(
    "Cerrar sesión",
    "¿Estás seguro de que querés cerrar sesión?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: () => onLogOut(),
      },
    ]
  );
};


const styles = StyleSheet.create({

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 25,
    marginBottom: 10
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    height: 70
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  itemText: {
    fontSize: 16,
    fontWeight: "500"
  }

})