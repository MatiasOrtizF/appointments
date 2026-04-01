import { Stack } from 'expo-router';

export default function SelectServiceLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // El index no tendrá header
      }}
    >
      <Stack.Screen 
        name="schedule-appointment" 
        options={{ title: "Schedule Appointment", headerShown: true }}
      />
    </Stack>
  )
}