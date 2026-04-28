import { Slot, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'

import { AlertNotificationRoot } from 'react-native-alert-notification'
import { ThemeProvider, useTheme } from '../src/data/provider/ThemeProvider'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../src/data/provider/AuthProvider'
import LoadingScreen from '../src/shared/LoadingScreen'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AlertNotificationRoot>
        <ThemeProvider>
          <AuthProvider>
            <NavigationGuard />
          </AuthProvider>
        </ThemeProvider>
      </AlertNotificationRoot>
    </SafeAreaProvider>
  )
}

function NavigationGuard() {
  const router = useRouter();
  const segments = useSegments();

  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";

    if (isAuthenticated && inAuthGroup) {
      router.replace("/bottom");
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, segments]);

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return <AppContent />;
}

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#1f1f1f" : "#f5f6fa"}
      />
      <Slot />
    </>
  );
}