import { Slot, useRouter, useSegments } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'

import { AlertNotificationRoot } from 'react-native-alert-notification'
import { ThemeProvider, useTheme } from '../src/data/provider/ThemeProvider'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../src/data/provider/AuthProvider'
import LoadingScreen from '../src/shared/LoadingScreen'
import { auth } from '../src/config/Firebase'

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
    const inVerifyScreen = segments.includes("verify-email");

    const currentUser = auth.currentUser;
    const isEmailVerified = currentUser?.emailVerified ?? false;


    // No logueado
    if (!isAuthenticated) {
      if (inVerifyScreen) {
        router.replace("/auth/login");
      }

      if (!inAuthGroup) {
        router.replace("/auth/login");
      }
      
      return;
    }

    // Logueado pero email NO verificado
    if (!isEmailVerified) {
      if (!inVerifyScreen) {
        router.replace("/auth/verify-email");
      }
      return;
    }

    // Logueado + verificado
    if (inAuthGroup) {
      router.replace("/bottom");
      return;
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