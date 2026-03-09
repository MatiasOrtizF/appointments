import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import SelectServiceScreen from '../../features/selectService/SelectServiceScreen'
import ProfileScreen from '../../features/profile/profileScreen'
import BookingScreen from '../../features/booking/BookingScreen'

const Tab = createBottomTabNavigator()

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="SelectService" component={SelectServiceScreen}/>
      <Tab.Screen name="Booking" component={BookingScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
  )
}