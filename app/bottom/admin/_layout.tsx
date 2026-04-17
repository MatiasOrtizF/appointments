import { Stack } from 'expo-router';
import { darkColors, lightColors } from '../../../src/theme/colors';
import { useTheme } from '../../../src/data/provider/ThemeProvider';

export default function AdminLayout() {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? darkColors : lightColors

  return (
    <Stack screenOptions={{
      headerShown: false,
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.headerTintColor,
    }}>
      <Stack.Screen
        name="index"
        options={{ title: "Admin" }}
      />
      <Stack.Screen
        name="appointment-admin"
        options={{ title: "Appointments Admin", headerShown: true }}
      />
    </Stack>
  );
}