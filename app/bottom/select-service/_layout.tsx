import { Stack } from 'expo-router';
import { useTheme } from '../../../src/data/provider/ThemeProvider';
import { darkColors, lightColors } from '../../../src/theme/colors';

export default function SelectServiceLayout() {
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
        options={{ title: "Select Service" }}
      />
      <Stack.Screen
        name="schedule-appointment"
        options={{ title: "Reservar turno", headerShown: true }}
      />
    </Stack>
  )
}