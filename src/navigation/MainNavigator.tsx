import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './tabs/MainTabs';
import { ScheduleAppointmentScreen } from '../features/schedule_appointment/ScheduleAppointmentScreen';
import AppointmentScreen from '../features/Appointments/AppointmentScreen';

export type MainStackParamList = {
  Tabs: undefined;
  ScheduleAppointment: { serviceId?: string };
  AdminAppointments: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
     <Stack.Navigator screenOptions={{ headerShown:false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="ScheduleAppointment" component={ScheduleAppointmentScreen}/>
      <Stack.Screen name="AdminAppointments" component={AppointmentScreen}/>
    </Stack.Navigator>
  )
}