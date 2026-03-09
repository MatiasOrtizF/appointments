import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './tabs/MainTabs';
import { ScheduleAppointmentScreen } from '../features/schedule_appointment/ScheduleAppointmentScreen';

export type MainStackParamList = {
  Tabs: undefined;
  ScheduleAppointment: { serviceId?: string };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
     <Stack.Navigator screenOptions={{ headerShown:false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
      <Stack.Screen name="ScheduleAppointment" component={ScheduleAppointmentScreen}/>
    </Stack.Navigator>
  )
}