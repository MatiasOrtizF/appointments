import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SelectServiceScreen from '../../features/selectService/SelectServiceScreen'
import BookingScreen from '../../features/booking/BookingScreen'
import { Ionicons } from '@expo/vector-icons'
import AdminScreen from '../../features/profile/AdminScreen'

const Tab = createBottomTabNavigator()

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#9ca3af",

        tabBarIcon: ({ color, size }) => {

          let iconName: React.ComponentProps<typeof Ionicons>["name"] = "cut-outline"


          if (route.name === "SelectService") {
            iconName = "cut-outline"
          } else if (route.name === "Booking") {
            iconName = "calendar-outline"
          } else if (route.name === "Admin") {
            iconName = "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        }
      })}
    >
      <Tab.Screen name="SelectService" component={SelectServiceScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Admin" component={AdminScreen} />
    </Tab.Navigator>
  )
}