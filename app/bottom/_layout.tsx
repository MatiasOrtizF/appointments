import { Tabs } from "expo-router";
import { darkColors, lightColors } from "../../src/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../src/data/provider/ThemeProvider";

export default function BottomLayout() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.secondary,   // color cuando está seleccionado
      tabBarInactiveTintColor: isDarkMode ? '#c9c9c9' : '#000000',

      tabBarStyle: {
        backgroundColor: isDarkMode ? '#121212' : '#eee',
        borderTopWidth: 0,
        elevation: 0,
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
      },
    }}>
      <Tabs.Screen
        name="select-service"
        options={{
          title: "Select Service",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="content-cut" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: "Booking",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: "Admin",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="admin-panel-settings" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}