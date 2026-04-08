import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="index" 
        options={{ title: "Admin" }} 
      />
      <Stack.Screen 
        name="appointment-admin" 
        options={{ title: "Appointments Admin", headerShown: true }}
      />
    </Stack>
  )
}