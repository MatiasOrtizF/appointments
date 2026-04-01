import { Stack } from 'expo-router';

export default function SelectServiceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{ title: "Select Service" }} 
      />
      <Stack.Screen 
        name="schedule-appointment" 
        options={{ title: "Schedule Appointment", headerShown: true }}
      />
    </Stack>
  )
}