import { Redirect, Stack } from 'expo-router';
import { darkColors, lightColors } from '../../../src/theme/colors';
import { useTheme } from '../../../src/data/provider/ThemeProvider';
import { useAuth } from '../../../src/data/provider/AuthProvider';
import LoadingScreen from '../../../src/shared/LoadingScreen';

export default function AdminLayout() {
  const { isDarkMode } = useTheme();
  const { loading, isAdmin } = useAuth();

  const colors = isDarkMode ? darkColors : lightColors

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  if (!isAdmin) {
    console.log("no es admin")
    return <Redirect href="/bottom/select-service" />;
  }

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
      <Stack.Screen
        name="service-admin"
        options={{ title: "Panel de servicios", headerShown: true }}
      />
      <Stack.Screen
        name="edit-service"
        options={{ title: "Editar servicio", headerShown: true }}
      />
    </Stack>
  );
}