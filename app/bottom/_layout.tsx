import { Tabs } from "expo-router";
import { colors } from "../../src/theme/colors";
import { MaterialIcons } from "@expo/vector-icons";

export default function BottomLayout() {

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.secondary,   // color cuando está seleccionado
      tabBarInactiveTintColor: '#000000',
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
          headerShown: true,
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