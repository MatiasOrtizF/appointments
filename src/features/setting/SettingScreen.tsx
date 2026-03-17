import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useSetting } from "./useSetting";

export const SettingsScreen = () => {

  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

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
      <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>

        <View style={styles.leftSection}>
          <Ionicons name={icon} size={22} color="#333" />
          <Text style={styles.itemText}>{title}</Text>
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

    <ScrollView style={styles.container}>

      <Text style={styles.sectionTitle}>Profile</Text>

      <SettingItem
        icon="person-outline"
        title="Edit profile"
        onPress={() => { }}
      />

      <SettingItem
        icon="lock-closed-outline"
        title="Change password"
        onPress={() => { }}
      />



      <Text style={styles.sectionTitle}>Appearance</Text>

      <SettingItem
        icon="moon-outline"
        title="Dark mode"
        rightComponent={
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
          />
        }
      />



      <Text style={styles.sectionTitle}>Notifications</Text>

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



      <Text style={styles.sectionTitle}>Business</Text>

      <SettingItem
        icon="time-outline"
        title="Working hours"
        onPress={() => { }}
      />

      <SettingItem
        icon="calendar-outline"
        title="Appointment duration"
        onPress={() => { }}
      />



      <Text style={styles.sectionTitle}>About</Text>

      <SettingItem
        icon="information-circle-outline"
        title="App version"
        onPress={() => { }}
      />



      <Text style={styles.sectionTitle}>Account</Text>

      <SettingItem
        icon="log-out-outline"
        title="Logout"
        onPress={logOut}
      />

    </ScrollView>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 20
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginTop: 25,
    marginBottom: 10
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10
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