import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // index de settings no muestra título
      }}
    >
      <Stack.Screen
        name="change-password"
        options={{ title: "Change Password", headerShown: true }}
      />
    </Stack>
  );
}